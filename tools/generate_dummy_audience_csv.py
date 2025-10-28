import csv, random, os
os.makedirs("tools", exist_ok=True)
out = "audience_dummy.csv"
with open(out, "w", newline="", encoding="utf-8") as fh:
    writer = csv.writer(fh)
    writer.writerow(["user_id","events","segment","geo","age_group","estimated_spend_usd"])
    for i in range(1,1001):
        uid = f"user_{i:06d}"
        events = random.randint(1,50)
        segment = random.choice(["Eco-Seekers","Quick-Buyers","Home-Lovers","Bargain-Hunters"])
        geo = random.choice(["IN-KA","IN-MH","IN-DL","IN-TN","IN-UP"])
        age_group = random.choice(["18-24","25-34","35-44","45-54","55+"])
        spend = round(random.uniform(10,2000),2)
        writer.writerow([uid, events, segment, geo, age_group, spend])
print("written", out)
