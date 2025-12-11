"""
Simple script to view all users in database
"""
import sqlite3

# Connect to database
conn = sqlite3.connect('instance/calorie_app.db')
cursor = conn.cursor()

# Get all users
cursor.execute("SELECT * FROM user")
users = cursor.fetchall()

# Get column names
cursor.execute("PRAGMA table_info(user)")
columns = [col[1] for col in cursor.fetchall()]

print("\n" + "="*80)
print("📊 REGISTERED USERS IN DATABASE")
print("="*80 + "\n")

if not users:
    print("❌ No users found in database.\n")
else:
    for user in users:
        print("👤 USER DETAILS:")
        print("-" * 80)
        for i, col in enumerate(columns):
            if col == 'password_hash':
                print(f"  {col}: [ENCRYPTED]")
            else:
                print(f"  {col}: {user[i]}")
        print("-" * 80)
        print()

print(f"✅ Total Users: {len(users)}\n")

conn.close()
