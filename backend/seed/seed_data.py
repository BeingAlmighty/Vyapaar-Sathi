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
    Resets the database and populates it with realistic merchant transaction data tailored
    for the Paytm Autonomous Growth Teammate hackathon demo using fast autocommit batching:
      - 6 Historical Months of alternating VERY HIGH SALES and VERY LOW SALES
      - Offered Combos:
          * Veg Supreme Burger + Cold Coffee Combo @ ₹149 (Regular ₹210)
          * Cheese Burger + Shake Combo @ ₹199 (Regular ₹270)
          * Pizza + Cold Coffee Combo @ ₹249 (Regular ₹310)
      - Cold Coffee excess stock (180 units in stock vs max 50 level)
      - Paneer Roll / Burger Buns low stock (8 units vs min 15 level)
      - Declining items: Veg Supreme Burger (-34%), Cheese Burger (-30%)
      - 24 designated inactive customers (no orders in past 45+ days)
      - Ineffective Promotion ("Monsoon Special 15% Off")
      - Autonomous Campaigns for Offered Combos pending approval
    """
    print(f"Connecting to database at {DATABASE_URL}...", flush=True)
    try:
        conn = psycopg.connect(DATABASE_URL, autocommit=True)
    except Exception as e:
        print(f"Error connecting to database: {e}", flush=True)
        sys.exit(1)

    with conn.cursor() as cur:
        print("Executing schema.sql DDL to reset database...", flush=True)
        schema_path = os.path.join(os.path.dirname(__file__), "..", "sql", "schema.sql")
        with open(schema_path, "r", encoding="utf-8") as f:
            schema_sql = f.read()

        statements = [stmt.strip() for stmt in schema_sql.split(";") if stmt.strip()]
        for stmt in statements:
            try:
                cur.execute(stmt)
            except Exception as e:
                print(f"Schema warning: {e}", flush=True)

        print("Schema reset successfully.", flush=True)

        # 1. Insert Merchant
        cur.execute("""
            INSERT INTO merchants (name, email, phone, business_name, business_type)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """, ("Rajesh Sharma", "rajesh.sharma@paytm-merchant.com", "+919876543210", "Rajesh Fast Food & Cafe", "Restaurant/Cafe"))
        merchant_id = cur.fetchone()[0]
        print(f"Created Merchant ID: {merchant_id}", flush=True)

        # 2. Insert Products (Individual items + Offered Combos)
        products_data = [
            ("Veg Supreme Burger", "Snacks", 120.00, 50.00),                    # Product 1 - Declining
            ("Cheese Burger", "Snacks", 150.00, 65.00),                         # Product 2 - Declining
            ("Cold Coffee", "Beverages", 90.00, 30.00),                          # Product 3 - Excess Stock
            ("Paneer Roll", "Snacks", 110.00, 45.00),                           # Product 4 - Low Stock
            ("Masala Chai", "Beverages", 30.00, 10.00),                          # Product 5 - Fast growing
            ("French Fries", "Sides", 80.00, 25.00),                            # Product 6 - Steady
            ("Veg Pizza 8-inch", "Main", 220.00, 95.00),                        # Product 7 - Top Seller
            ("Chocolate Shake", "Beverages", 120.00, 40.00),                      # Product 8 - Steady
            ("Veg Supreme Burger + Cold Coffee Combo", "Combos", 149.00, 80.00),  # Product 9 - Offered Combo 1
            ("Cheese Burger + Shake Combo", "Combos", 199.00, 105.00),            # Product 10 - Offered Combo 2
            ("Pizza + Cold Coffee Combo", "Combos", 249.00, 125.00)               # Product 11 - Offered Combo 3
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

        print(f"Inserted {len(product_ids)} products.", flush=True)

        # 3. Insert Inventory
        inventory_data = [
            (product_ids["Veg Supreme Burger"], 25, 15, 60),
            (product_ids["Cheese Burger"], 18, 15, 60),
            (product_ids["Cold Coffee"], 180, 20, 50),       # Excess stock problem (180 units vs max 50)
            (product_ids["Paneer Roll"], 8, 15, 50),         # Low stock risk (8 units vs min 15)
            (product_ids["Masala Chai"], 60, 25, 100),
            (product_ids["French Fries"], 40, 20, 80),
            (product_ids["Veg Pizza 8-inch"], 12, 10, 40),
            (product_ids["Chocolate Shake"], 30, 15, 50),
            (product_ids["Veg Supreme Burger + Cold Coffee Combo"], 50, 10, 100),
            (product_ids["Cheese Burger + Shake Combo"], 40, 10, 100),
            (product_ids["Pizza + Cold Coffee Combo"], 30, 10, 100)
        ]
        cur.executemany("""
            INSERT INTO inventory (merchant_id, product_id, current_stock, min_reorder_level, max_stock_level)
            VALUES (%s, %s, %s, %s, %s);
        """, [(merchant_id, pid, stock, min_lvl, max_lvl) for pid, stock, min_lvl, max_lvl in inventory_data])

        print("Inserted inventory records.", flush=True)

        # 4. Insert Customers (36 active, 24 inactive)
        now = datetime.now(timezone.utc)
        customer_ids = []

        for i in range(1, 37):
            first_date = now - timedelta(days=random.randint(90, 180))
            last_date = now - timedelta(days=random.randint(1, 20))
            cur.execute("""
                INSERT INTO customers (merchant_id, name, phone, email, first_order_date, last_order_date, total_orders, total_spend)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (merchant_id, f"Customer Active {i}", f"+9199000{i:05d}", f"active{i}@example.com", first_date, last_date, random.randint(4, 15), random.uniform(800, 4500)))
            customer_ids.append(cur.fetchone()[0])

        for i in range(1, 25):
            first_date = now - timedelta(days=random.randint(120, 240))
            last_date = now - timedelta(days=random.randint(46, 110))
            cur.execute("""
                INSERT INTO customers (merchant_id, name, phone, email, first_order_date, last_order_date, total_orders, total_spend)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (merchant_id, f"Customer Inactive {i}", f"+9198000{i:05d}", f"inactive{i}@example.com", first_date, last_date, random.randint(1, 3), random.uniform(150, 600)))
            customer_ids.append(cur.fetchone()[0])

        print(f"Inserted {len(customer_ids)} customers (24 inactive).", flush=True)

        # 5. Fast Batch Seeding for 6 Alternating Months
        months_config = [
            (150, 180, 20, 0.55),
            (120, 150, 6, 0.40),
            (90, 120, 24, 0.60),
            (60, 90, 7, 0.35),
            (30, 60, 28, 0.62),
            (0, 30, 10, 0.32)
        ]

        tx_rows = []
        tx_item_rows = []
        tx_counter = 1

        for start_d, end_d, tx_count, burger_prob in months_config:
            for _ in range(tx_count):
                tx_date = now - timedelta(
                    days=random.randint(start_d, end_d),
                    hours=random.randint(0, 23),
                    minutes=random.randint(0, 59)
                )
                cust_id = random.choice(customer_ids)

                items_to_add = []
                if random.random() < 0.25:
                    combo_choice = random.choice([
                        ("Veg Supreme Burger + Cold Coffee Combo", 149.00),
                        ("Cheese Burger + Shake Combo", 199.00),
                        ("Pizza + Cold Coffee Combo", 249.00)
                    ])
                    items_to_add.append((product_ids[combo_choice[0]], 1, combo_choice[1]))
                else:
                    if random.random() < burger_prob:
                        b_pid = product_ids["Veg Supreme Burger"] if random.random() < 0.5 else product_ids["Cheese Burger"]
                        items_to_add.append((b_pid, 1, 120.00 if b_pid == product_ids["Veg Supreme Burger"] else 150.00))
                        if random.random() < 0.40:
                            items_to_add.append((product_ids["Cold Coffee"], 1, 90.00))

                    if random.random() < 0.50:
                        items_to_add.append((product_ids["Veg Pizza 8-inch"], 1, 220.00))

                    if random.random() < 0.45:
                        items_to_add.append((product_ids["Masala Chai"], random.randint(1, 3), 30.00))

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
                    tx_item_rows.append((tx_id, pid, qty, unit_p, qty * unit_p))

                tx_counter += 1

        print("Bulk inserting transaction items...", flush=True)
        cur.executemany("""
            INSERT INTO transaction_items (transaction_id, product_id, quantity, unit_price, total_amount)
            VALUES (%s, %s, %s, %s, %s);
        """, tx_item_rows)

        print(f"Inserted total {tx_counter-1} transactions across 6 alternating high/low sales months.", flush=True)

        # 6. Insert Promotions
        cur.execute("""
            INSERT INTO promotions (merchant_id, name, discount_percent, start_date, end_date, target_category, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (merchant_id, "Monsoon Special 15% Off", 15.00, now - timedelta(days=15), now + timedelta(days=15), "Beverages", "active"))

        cur.execute("""
            INSERT INTO promotions (merchant_id, name, discount_percent, start_date, end_date, target_category, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (merchant_id, "Offered Combo Fest: Burger & Cold Coffee @ ₹149", 29.00, now - timedelta(days=5), now + timedelta(days=25), "Combos", "active"))

        print("Promotions inserted.", flush=True)

        # 7. Insert Autonomous Campaigns
        cur.execute("""
            INSERT INTO campaigns (merchant_id, title, description, campaign_type, status, target_audience, metrics_json)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (
            merchant_id,
            "Offered Combo: Veg Supreme Burger + Cold Coffee @ ₹149",
            "Clear 180 units of excess Cold Coffee stock while boosting declining Veg Supreme Burger sales. Offered combo bundle price ₹149 vs regular ₹210.",
            "retention",
            "pending_approval",
            "24 Inactive Customers",
            '{"regular_price": 210, "combo_price": 149, "expected_reach": 24, "projected_monthly_revenue": 6800, "estimated_margin_gain": 2400}'
        ))

        cur.execute("""
            INSERT INTO campaigns (merchant_id, title, description, campaign_type, status, target_audience, metrics_json)
            VALUES (%s, %s, %s, %s, %s, %s, %s);
        """, (
            merchant_id,
            "Cheese Burger + Shake Weekend Power Combo @ ₹199",
            "Weekend boost offered combo bundling Cheese Burger with Chocolate Shake to raise average order value by 22%.",
            "upsell",
            "active",
            "All Returning Customers",
            '{"regular_price": 270, "combo_price": 199, "expected_reach": 150, "projected_monthly_revenue": 14500}'
        ))

        print("Campaigns inserted.", flush=True)
        print("SEED COMPLETED SUCCESSFULLY!", flush=True)

if __name__ == "__main__":
    seed_database()
