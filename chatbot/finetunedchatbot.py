import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel


base_model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"

# Load base model and tokenizer
model = AutoModelForCausalLM.from_pretrained(base_model_name, torch_dtype=torch.float32)
tokenizer = AutoTokenizer.from_pretrained(base_model_name)

# Load LoRA adapter
model = PeftModel.from_pretrained(model, "./models_lora")
while True:
    question = input("Ask a question: ")
    prompt = f"### Question: {question}\n### Answer:"

    inputs = tokenizer(prompt, return_tensors="pt")

    outputs = model.generate(
        **inputs,
        max_new_tokens=60,  # small enough to prevent rambling
        eos_token_id=tokenizer.eos_token_id,
        pad_token_id=tokenizer.eos_token_id,  # prevent padding issues
        do_sample=True,
        temperature=0.7,
        top_p=0.9
    )

    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract only the answer part
    if "### Answer:" in response:
        print("🤖", response.split("### Answer:")[-1].strip())
    else:
        print("🤖", response)
