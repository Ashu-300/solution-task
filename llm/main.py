from fastapi import FastAPI, UploadFile, File

from fastapi.responses import JSONResponse

from PIL import Image

import openai

import io

import json

app = FastAPI(title="Clean City API")

Set your OpenAI API key

openai.api_key = "YOUR_OPENAI_API_KEY"  # <-- Replace with your key

@app.get("/")

def home():

return {"message": "Clean City API Running 🚀"}

@app.post("/analyze-waste")

async def analyze_waste(file: UploadFile = File(...)):

# Read the uploaded image

contents = await file.read()



# Get image info

image = Image.open(io.BytesIO(contents))

image_info = {

    "filename": file.filename,

    "format": image.format,

    "mode": image.mode,

    "size": image.size

}



# Prompt for AI

prompt = """

You are an AI waste classifier.

Analyze the uploaded image and provide the following:

1. Waste Type: e.g., Organic, Plastic, Metal, Paper, E-waste

2. Suggestions: How to properly dispose or recycle it

3. Bin Type: e.g., Green bin, Blue bin, Red bin, Yellow bin

Return only JSON like this:

{

    "waste_type": "...",

    "suggestions": "...",

    "bin_type": "..."

}

"""



try:

    # Call OpenAI Vision-enabled model

    response = openai.chat.completions.create(

        model="gpt-4o-mini",

        messages=[{"role": "user", "content": prompt}],

        modalities=["image"],     # tell the model an image is included

        image=contents            # pass image bytes here

    )



    ai_output = response.choices[0].message.content



    # Parse AI output as JSON

    try:

        ai_json = json.loads(ai_output)

    except json.JSONDecodeError:

        ai_json = {"waste_type": "Unknown", "suggestions": ai_output, "bin_type": "Unknown"}



except Exception as e:

    ai_json = {"waste_type": "Error", "suggestions": str(e), "bin_type": "Error"}



# Return image info + AI classification

return JSONResponse(content={

    "image_info": image_info,

    "classification": ai_json

})