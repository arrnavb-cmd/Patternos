# Read the file
with open('app/main.py', 'r') as f:
    content = f.read()

# Replace CORS config
old_cors = '''app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)'''

new_cors = '''app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)'''

content = content.replace(old_cors, new_cors)

# Write back
with open('app/main.py', 'w') as f:
    f.write(content)

print("✅ Fixed CORS!")
