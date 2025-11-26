from setuptools import setup, find_packages

setup(
    name="patternos",
    version="0.1.0",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[
        "fastapi",
        "uvicorn[standard]",
        "sqlalchemy",
        "pydantic",
        "PyJWT",
        "python-jose",
        "psycopg2-binary",
        "pandas",
        "pyarrow",
        "pytest",
        "pytest-cov",
        "pytest-asyncio",
    ],
)
