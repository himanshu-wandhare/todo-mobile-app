## 🛠️ Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:

```bash
cd backend
```

2. **Create a virtual environment** (recommended):

```bash
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

3. **Install dependencies**:

```bash
pip install -r requirements.txt
```

4. **Run the FastAPI server**:

```bash
python main.py
```

The API will be available at `http://localhost:8000`

5. **View API documentation**:

-   Swagger UI: http://localhost:8000/docs
-   ReDoc: http://localhost:8000/redoc

## 🔌 API Endpoints

### Authentication

-   `POST /api/auth/signup` - Register new user
-   `POST /api/auth/login` - Login user
-   `GET /api/user/profile` - Get user profile (protected)

### Todos

-   `GET /api/todos` - Get all todos (with optional status filter)
-   `POST /api/todos` - Create new todo
-   `GET /api/todos/{id}` - Get specific todo
-   `PUT /api/todos/{id}` - Update todo
-   `DELETE /api/todos/{id}` - Delete todo
-   `GET /api/todos/stats/summary` - Get todo statistics
