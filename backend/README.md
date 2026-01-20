# Nila.ai Backend

## Setup

1. Create virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Fill in your credentials in `.env`:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (NOT anon key)
- `OPENAI_API_KEY`: Your OpenAI API key

5. Run the server:
```bash
python main.py
```

The server will start at `http://localhost:8000`

## Supabase Setup

Create a `profiles` table with:
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    nila_memory TEXT DEFAULT '',
    streak_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

## Endpoints

- `GET /` - Health check
- `POST /chat` - Send message to Nila
  - Body: `{ "message": "string", "user_id": "string" }`
  - Returns: `{ "response": "string" }`
