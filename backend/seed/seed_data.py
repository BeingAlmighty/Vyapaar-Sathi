import os
import sys
import random
from datetime import datetime, timedelta, timezone
import psycopg
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/paytm_growth_db")

def seed_database():
    """
    Populates the database with realistic merchant transaction data tailored
    for the hackathon demo with specific anomalies:
      - Burger sales down ~34% over recent 30 days
      - Cold Coffee excess stock (180 units, low sales velocity)
      - Paneer Roll declining
      - 24 inactive customers (no orders in past 45+ days)
      - Returning customer rate declining
      - 1 Ineffective Promotion ("Monsoon Special 15% Off")
      - Burger + Cold Coffee strong association (frequently bought together)
    """
    print(f"Connecting to database at {DATABASE_URL}...")
    try:
        conn = psycopg.connect(DATABASE_URL, autocommit=True)
    except Exception as e:
        print(f"Error connecting to database: {e}")
        print("Please ensure PostgreSQL server is running and the database exists.")
        sys.exit(1)

    with conn.cursor() as cur:
        print("Disabling statement timeout for schema setup...")
        try:
            cur.execute("SET statement_timeout = 0;")
        except Exception as e:
            print(f"Notice: Could not set statement_timeout: {e}")

        print("Reading schema.sql...")
        schema_path = os.path.join(os.path.dirname(__file__), "..", "sql", "schema.sql")
        with open(schema_path, "r", encoding="utf-8") as f:
            schema_sql = f.read()

        # Execute DDL statements individually for Supabase pooler compatibility
        statements = [stmt.strip() for stmt in schema_sql.split(";") if stmt.strip()]
        for stmt in statements:
            try:
                cur.execute(stmt)
            except Exception as e:
                print(f"Warning on schema DDL: {e}")

        print("Schema initialized successfully.")

    # Re-open transactional block for seeding data
    conn.autocommit = False
    with conn:
        with conn.cursor() as cur:
            # 1. Insert Merchant
            cur.execute("""
                INSERT INTO merchants (name, email, phone, business_name, business_type)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
            """, ("Rajesh Sharma", "rajesh.sharma@paytm-merchant.com", "+919876543210", "Rajesh Fast Food & Cafe", "Restaurant/Cafe"))
            merchant_id = cur.fetchone()[0]
            print(f"Created Merchant ID: {merchant_id}")

            # 2. Insert Products
            products_data = [
                ("Veg Supreme Burger", "Snacks", 120.00, 50.00),     # Product 1 - Declining 34%
                ("Cheese Burger", "Snacks", 150.00, 65.00),          # Product 2 - Declining 30%
                ("Cold Coffee", "Beverages", 90.00, 30.00),           # Product 3 - Excess Stock
                ("Paneer Roll", "Snacks", 110.00, 45.00),            # Product 4 - Declining 25%
                ("Masala Chai", "Beverages", 30.00, 10.00),           # Product 5 - Fast growing
                ("French Fries", "Sides", 80.00, 25.00),             # Product 6 - Steady
                ("Veg Pizza 8-inch", "Main", 220.00, 95.00),         # Product 7 - Top Seller
                ("Chocolate Shake", "Beverages", 120.00, 40.00)       # Product 8 - Steady
            ]

            product_ids = {}
            for name, category, price, cost in products_data:
                cur.execute("""
                    INSERT INTO products (merchant_id, name, category, price, cost_price)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id;
                """, (merchant_id, name, category, price, cost))
                pid = cur.fetchone()[0]
                product_ids[name] = pid

            print(f"Inserted {len(product_ids)} products.")

            # 3. Insert Inventory
            inventory_data = [
                (product_ids["Veg Supreme Burger"], 25, 15, 60),
                (product_ids["Cheese Burger"], 18, 15, 60),
                (product_ids["Cold Coffee"], 180, 20, 50),       # Excess stock problem!
                (product_ids["Paneer Roll"], 8, 15, 50),         # Low stock risk
                (product_ids["Masala Chai"], 60, 25, 100),
                (product_ids["French Fries"], 40, 20, 80),
                (product_ids["Veg Pizza 8-inch"], 12, 10, 40),
                (product_ids["Chocolate Shake"], 30, 15, 50)
            ]
            for pid, stock, min_lvl, max_lvl in inventory_data:
                cur.execute("""
                    INSERT INTO inventory (merchant_id, product_id, current_stock, min_reorder_level, max_stock_level)
                    VALUES (%s, %s, %s, %s, %s);
                """, (merchant_id, pid, stock, min_lvl, max_lvl))

            print("Inserted inventory records.")

            # 4. Insert Customers (Total 60 customers: 24 inactive, 36 active)
            now = datetime.now(timezone.utc)
            customer_ids = []
            
            # Active Customers (36)
            for i in range(1, 37):
                name = f"Customer Active {i}"
                phone = f"+9199000{i:05d}"
                first_date = now - timedelta(days=random.randint(60, 120))
                last_date = now - timedelta(days=random.randint(1, 20)) # recent
                cur.execute("""
                    INSERT INTO customers (merchant_id, name, phone, email, first_order_date, last_order_date, total_orders, total_spend)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (merchant_id, name, phone, f"active{i}@example.com", first_date, last_date, random.randint(3, 12), random.uniform(500, 3000)))
                customer_ids.append(cur.fetchone()[0])

            # Inactive Customers (24) -> No orders in last 45 to 90 days!
            for i in range(1, 25):
                name = f"Customer Inactive {i}"
                phone = f"+9198000{i:05d}"
                first_date = now - timedelta(days=random.randint(90, 180))
                last_date = now - timedelta(days=random.randint(46, 95)) # inactive > 45 days
                cur.execute("""
                    INSERT INTO customers (merchant_id, name, phone, email, first_order_date, last_order_date, total_orders, total_spend)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (merchant_id, name, phone, f"inactive{i}@example.com", first_date, last_date, random.randint(1, 3), random.uniform(150, 600)))
                customer_ids.append(cur.fetchone()[0])

            print(f"Inserted {len(customer_ids)} customers (24 designated inactive).")

            # 5. Insert Transactions over 60 days
            print("Generating historical transactions...")
            
            # Period 1 (Previous Month: 31-60 days ago): 250 transactions
            for _ in range(250):
                tx_date = now - timedelta(days=random.randint(31, 60), hours=random.randint(0, 23), minutes=random.randint(0, 59))
                cust_id = random.choice(customer_ids)
                
                items_to_add = []
                if random.random() < 0.60:
                    burger_pid = product_ids["Veg Supreme Burger"] if random.random() < 0.5 else product_ids["Cheese Burger"]
                    items_to_add.append((burger_pid, random.randint(1, 2), 120.00 if burger_pid == product_ids["Veg Supreme Burger"] else 150.00))
                    if random.random() < 0.45:
                        items_to_add.append((product_ids["Cold Coffee"], 1, 90.00))
                
                if random.random() < 0.40:
                    items_to_add.append((product_ids["Veg Pizza 8-inch"], 1, 220.00))
                
                if random.random() < 0.35:
                    items_to_add.append((product_ids["Masala Chai"], random.randint(1, 3), 30.00))

                if random.random() < 0.30:
                    items_to_add.append((product_ids["Paneer Roll"], 1, 110.00))

                if not items_to_add:
                    items_to_add.append((product_ids["French Fries"], 1, 80.00))

                total_amount = sum(qty * price for pid, qty, price in items_to_add)

                cur.execute("""
                    INSERT INTO transactions (merchant_id, customer_id, transaction_date, total_amount, payment_method, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (merchant_id, cust_id, tx_date, total_amount, random.choice(['UPI', 'Paytm QR', 'Cash', 'Card']), 'completed'))
                tx_id = cur.fetchone()[0]

                for pid, qty, unit_p in items_to_add:
                    cur.execute("""
                        INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, total_amount)
                        VALUES (%s, %s, %s, %s, %s);
                    """, (tx_id, pid, qty, unit_p, qty * unit_p))

            # Period 2 (Current Month: 0-30 days ago): 180 transactions (Burger sales down ~34%)
            for _ in range(180):
                tx_date = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23), minutes=random.randint(0, 59))
                cust_id = random.choice(customer_ids[:36])
                
                items_to_add = []
                if random.random() < 0.35:
                    burger_pid = product_ids["Veg Supreme Burger"] if random.random() < 0.5 else product_ids["Cheese Burger"]
                    items_to_add.append((burger_pid, 1, 120.00 if burger_pid == product_ids["Veg Supreme Burger"] else 150.00))
                    if random.random() < 0.40:
                        items_to_add.append((product_ids["Cold Coffee"], 1, 90.00))

                if random.random() < 0.55:
                    items_to_add.append((product_ids["Veg Pizza 8-inch"], 1, 220.00))

                if random.random() < 0.45:
                    items_to_add.append((product_ids["Masala Chai"], random.randint(1, 2), 30.00))

                if random.random() < 0.15:
                    items_to_add.append((product_ids["Paneer Roll"], 1, 110.00))

                if not items_to_add:
                    items_to_add.append((product_ids["French Fries"], 1, 80.00))

                total_amount = sum(qty * price for pid, qty, price in items_to_add)

                cur.execute("""
                    INSERT INTO transactions (merchant_id, customer_id, transaction_date, total_amount, payment_method, status)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id;
                """, (merchant_id, cust_id, tx_date, total_amount, random.choice(['UPI', 'Paytm QR', 'Cash']), 'completed'))
                tx_id = cur.fetchone()[0]

                for pid, qty, unit_p in items_to_add:
                    cur.execute("""
                        INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, total_amount)
                        VALUES (%s, %s, %s, %s, %s);
                    """, (tx_id, pid, qty, unit_p, qty * unit_p))

            print("Historical transactions inserted.")

            # 6. Insert Promotions
            cur.execute("""
                INSERT INTO promotions (merchant_id, name, discount_percent, start_date, end_date, target_category, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (merchant_id, "Monsoon Special 15% Off", 15.00, now - timedelta(days=15), now + timedelta(days=15), "Beverages", "active"))
            
            cur.execute("""
                INSERT INTO promotions (merchant_id, name, discount_percent, start_date, end_date, target_category, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (merchant_id, "Weekend Pizza Fest 10% Off", 10.00, now - timedelta(days=30), now - timedelta(days=5), "Main", "expired"))

            print("Promotions inserted.")

            # 7. Insert Campaigns
            cur.execute("""
                INSERT INTO campaigns (merchant_id, title, description, campaign_type, status, target_audience, metrics_json)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
            """, (
                merchant_id,
                "Winback Inactive Customers - Burger & Coffee Combo",
                "Target 24 inactive customers with 20% discount on Burger + Cold Coffee combo",
                "retention",
                "pending_approval",
                "24 Inactive Customers",
                '{"expected_reach": 24, "projected_revenue": 4800, "estimated_discount": 960}'
            ))

            print("Campaign inserted.")
            print("Seed completed successfully!")

if __name__ == "__main__":
    seed_database()
