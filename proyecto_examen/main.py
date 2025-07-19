from fastapi import (FastAPI, HTTPException, status,
                    Request, Query)
from database import engine, inicializar_bd
from sqlmodel import Session, select
from models import Estudiante
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI()

inicializar_bd()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Monta la carpeta frontend en la raíz
app.mount("/frontend", StaticFiles(directory="frontend", html=True), name="frontend")

@app.get("/")
def read_root():
    return {"Hello": "Hello World"}

# CRUD
# CREATE
# READ
# UPDATE Actualizar
# DELETE

@app.get("/estudiantes")
def leer_estudiantes(resquest:Request, 
                     skip:int = Query(0, ge=0),
                     limit:int = Query(10, ge=1)
                     ):
    with Session(engine) as session:
        total = session.exec(select(Estudiante)).all()
        total_conteo = len(total)
        estudiantes_pagina = session.exec(
            select(Estudiante).offset(skip).limit(limit)
        ).all()
        base_url = str(resquest.url).split('?')[0]
        siguiente_skip = skip + limit
        anterior_skip = max(0, skip-limit)
        siguiente_url = f"{base_url}?skip={siguiente_skip}&limit={limit}" if siguiente_skip < total_conteo else None
        anterior_url = f"{base_url}?skip={anterior_skip}&limit={limit}" if skip > 0 else None
        return {
            "count": total_conteo,
            "next": siguiente_url,
            "previous": anterior_url,
            "details": estudiantes_pagina
        }

@app.get("/estudiantes/{matricula}", response_model=Estudiante)
def leer_estudiante(matricula:str):
    with Session(engine) as session:
        estudiante = session.get(Estudiante, matricula)
        if not estudiante:
            raise HTTPException(status_code=404, detail="El estudiante no encontrado")
        return estudiante
    
@app.post("/estudiantes", response_model=Estudiante, 
          status_code=status.HTTP_201_CREATED)
def crear_estudiante(estudiante:Estudiante):
    with Session(engine) as session:
        session.add(estudiante)
        session.commit()
        session.refresh(estudiante)
        return estudiante
    
@app.delete("/estudiantes/{matricula}", 
            status_code=status.HTTP_204_NO_CONTENT)
def eliminar_estudiante(matricula:str):
    with Session(engine) as session:
        estudiante = session.get(Estudiante, matricula)
        if not estudiante:
            raise HTTPException(status_code=404, 
                                detail="El estudiante no encontrado")
        session.delete(estudiante)
        session.commit()

@app.put("/estudiantes/{matricula}", response_model=Estudiante)
def actualizar_estudiante(matricula:str, 
                          estudiante_actualizar:Estudiante):
    with Session(engine) as session:
        estudiante = session.get(Estudiante, matricula)
        if not estudiante:
            raise HTTPException(status_code=404, 
                                detail="El estudiante no encontrado")
        estudiante.nombre = estudiante_actualizar.nombre
        estudiante.apellidos = estudiante_actualizar.apellidos
        estudiante.genero = estudiante_actualizar.genero
        estudiante.direccion = estudiante_actualizar.direccion
        estudiante.telefono = estudiante_actualizar.telefono

        session.add(estudiante)
        session.commit()
        session.refresh(estudiante)
        return estudiante