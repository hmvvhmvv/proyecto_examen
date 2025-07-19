from sqlmodel import SQLModel, Field

class Estudiante(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    matricula: str
    nombre: str
    apellidos: str
    genero: str
    direccion: str
    telefono: str