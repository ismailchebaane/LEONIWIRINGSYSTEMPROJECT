from datasets import Dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, TrainingArguments, Trainer
from peft import get_peft_model, LoraConfig, TaskType
from transformers import DataCollatorForLanguageModeling
import pandas as pd
import torch
from transformers import BitsAndBytesConfig
import wandb
wandb.init(project="tinyllama-csv-finetune", name="cpu-run")

# Load and preprocess your dataset
df = pd.read_csv("data/cleaned_dataset.csv")

examples = []
for _, row in df.iterrows():
    question = f"What is the equipment status of {row['master_data_name']} in {row['plant']}?"
    answer = f"The equipment status is {row['equipment_status']}."
    examples.append({"text": f"### Question: {question}\n### Answer: {answer}"})

dataset = Dataset.from_list(examples)

# Load tokenizer and model
model_name = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
tokenizer = AutoTokenizer.from_pretrained(model_name, use_fast=True)
from transformers import BitsAndBytesConfig

model = AutoModelForCausalLM.from_pretrained(
    model_name,
    torch_dtype=torch.float32,  # or float16 if you somehow use a supported GPU
    device_map="auto"  # automatically maps to CPU/GPU
)

# Add LoRA adapter using PEFT
peft_config = LoraConfig(
    r=8,
    lora_alpha=16,
    task_type=TaskType.CAUSAL_LM,
    lora_dropout=0.1,
    bias="none"
)
model = get_peft_model(model, peft_config)

# Tokenize
def tokenize(example):
    return tokenizer(example["text"], truncation=True, padding="max_length", max_length=128)

tokenized = dataset.map(tokenize)

# Training config
training_args = TrainingArguments(
    output_dir="./models_lora",
    per_device_train_batch_size=1,
    num_train_epochs=3,
    learning_rate=2e-4,
    logging_steps=10,
    save_steps=100,
    save_total_limit=1,
    fp16=True,  # if CUDA is available
    logging_dir="./logs",
report_to="wandb",

)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=tokenized,
    tokenizer=tokenizer,
    data_collator=DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False),
)

trainer.train()

# Save the adapter (not full model)
model.save_pretrained("./models_lora")
tokenizer.save_pretrained("./models_lora")
