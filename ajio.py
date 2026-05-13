import requests
from bs4 import BeautifulSoup
import pandas as pd

url = "https://www.ajio.com/shop/s?searchQuery=trousers"

headers = {
    "User-Agent": "Mozilla/5.0"
}

response = requests.get(url, headers=headers)

print("Status Code:", response.status_code)

soup = BeautifulSoup(response.content, "html.parser")

# Lists
product_names = []
prices = []
images = []
ratings = []

# Product cards
products = soup.find_all("div", class_="item")

print("Total Products:", len(products))

for product in products:

    name = product.find("div", class_="nameCls")
    price = product.find("span", class_="price")
    image = product.find("img")
    rating = product.find("div", class_="rating")

    # Product Name
    if name:
        product_names.append(name.text.strip())
    else:
        product_names.append("No Name")

    # Price
    if price:
        prices.append(price.text.strip())
    else:
        prices.append("No Price")

    # Image
    if image:
        images.append(image.get("src"))
    else:
        images.append("No Image")

    # Rating
    if rating:
        ratings.append(rating.text.strip())
    else:
        ratings.append("No Rating")

# DataFrame
df = pd.DataFrame({
    "Product Name": product_names,
    "Price": prices,
    "Image": images,
    "Rating": ratings
})

# Save CSV
df.to_csv("ajio.csv", index=False)

# Print first rows
print(df.head())