# FastAPI Project

This project is a backend API built using **FastAPI**, **Uvicorn**, **SQLite**, and **SQLAlchemy**. It provides RESTful endpoints with easy deployment and database support.

## Table of Contents

- [FastAPI Project](#fastapi-project)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Steps](#steps)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

---

## Installation

### Prerequisites

- **Python 3.8+** installed
- **virtualenv** (optional but recommended)

### Steps

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. Create a virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Usage

1. Run the server with Uvicorn:

   ```bash
   uvicorn app.main:app --reload
   ```

2. The API will be available at: [http://127.0.0.1:8000](http://127.0.0.1:8000)

3. API documentation is available at:
   - **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
   - **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## License

This project is licensed under the MIT License.
