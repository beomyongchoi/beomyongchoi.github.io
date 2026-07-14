---
title: "A Closer Look at LoRA (Low-Rank Adaptation)"
description: "How LoRA tackles the cost of fine-tuning LLMs — the low-rank hypothesis, the two-path architecture, its practical trade-offs, and how it compares to other PEFT methods."
pubDate: 2025-09-16
lang: en
translationKey: "lora-deep-dive"
tags: ["LLM", "PEFT", "LoRA", "Fine-tuning", "Aiffel"]
heroImage: "/assets/lora.png"
---

Parameter-efficient fine-tuning (PEFT) has become a big deal for LLMs, and recently I got the chance to dig into LoRA (Low-Rank Adaptation) in particular. LoRA takes a genuinely clever, practical swing at the cost problem of fine-tuning.

Here's my write-up of how I understand it — from the core idea, to how it works, to where it helps and where it doesn't.

## 1. Where it starts: the cost of full fine-tuning

The most obvious way to adapt an LLM to a domain or task is *full fine-tuning*: you take a pre-trained model, update all of its weights (`W`) on your new data, and end up with `W' = W + ΔW`.

The problem is that you're training every single one of those hundreds of billions of parameters — which eats enormous GPU memory and time. And for every new task, you have to store a full copy of the model, roughly as big as the original. That's a lot of waste.

## 2. The core hypothesis: "ΔW is low-rank"

This is where the LoRA authors make their key bet.

> **[From the paper (Abstract):](https://arxiv.org/pdf/2106.09685)**
> "We hypothesize that the change in weights during model adaptation has a low 'intrinsic rank', leading to our proposed method."

In plain terms: the *change* in weights you need to adapt a model to a new task has a low **intrinsic rank**.

"Low rank" means the matrix doesn't actually carry that much informational complexity. So the huge `ΔW` matrix can be **approximated by the product of two much smaller, lower-dimensional matrices `A` and `B` (`ΔW ≈ B * A`)**. The insight is that what a model needs in order to specialize for a task is less complex than it looks, and can be squeezed into a much simpler form.

## 3. The architecture: learning through two paths

Building on that hypothesis, LoRA keeps the original weights `W` frozen and only trains the small matrices `A` and `B` that mimic `ΔW`.

![LoRA architecture diagram](/assets/lora.png)

As the diagram shows, a LoRA forward pass splits into two paths:

1.  **The original path**: input `x` goes through the big, frozen `W`. (`h = Wx`)
2.  **The LoRA path**: the same input `x` goes through the low-rank matrices `A` and `B` in sequence. (`Δh = BAx`)

The final output is the sum of both paths, `h + Δh`. So you **keep all the rich expressiveness of the original model, and only learn the minimal "correction" the new task needs, then add it on top**.

Because of this design, the number of trainable parameters drops dramatically. Say you're tuning a 4096×4096 matrix (~16.77M parameters). With LoRA at rank 8, you only train `(4096*8) + (8*4096)` ≈ 65K parameters — a **99%+ reduction**.

## 4. An intuitive analogy: Photoshop plugins

This gets easier if you think of it in terms of Photoshop.

1.  **Pre-trained model → the Photoshop application itself**
    -   A large language model like `klue/bert-base` is like Photoshop: packed with capability, and hugely powerful for image processing (language understanding) out of the box.

2.  **Full fine-tuning → reinstalling all of Photoshop**
    -   To add a "portrait retouching" feature, you rewrite Photoshop's entire source and reinstall the whole tens-of-GB program. Wildly inefficient, and it doubles your storage.

3.  **LoRA → a Photoshop plugin**
    -   You leave the original Photoshop completely untouched and build a lightweight few-MB plugin (the LoRA adapter) that just does "portrait retouching." You enable it when you need it, and swap in a different plugin when you need something else.

## 5. LoRA's pros and cons, practically speaking

**Pros:**

-   **Efficient training**: fine-tune with far less GPU memory and time.
-   **Efficient storage**: you only save a few-MB LoRA adapter per task, which is easy to manage.
-   **Fast task switching**: share one base model and swap LoRA adapters as needed — plug and play.
-   **No inference latency**: after training, merge the adapter back into the original weights (`W' = W + BA`), and inference has zero extra computation, so no performance hit.

**Cons and caveats:**

-   **A performance ceiling**: if a task is complex enough that it genuinely needs "high-rank" weight changes, LoRA can fall a bit short of full fine-tuning.
-   **Hyperparameters**: to get the best results, you have to tune extra knobs like `r` (rank) and `lora_alpha`.

> **So LoRA's downsides aren't really "reasons not to use it" — they're more "things to understand and adjust so you can use it well."**

## 6. How it compares to other PEFT methods

LoRA isn't the only PEFT method, and each has its own philosophy.

-   **Adapters**: insert new neural modules *in series* between model layers and train those. Unlike LoRA's parallel structure, this can add a little inference latency.
-   **Prompt Tuning**: leaves the model weights entirely untouched and only learns "virtual token" vectors that become part of the input prompt.
    > **What's a "learnable virtual token"?**
    >
    > The idea starts from the fact that a model's real input isn't words but *embedding vectors*. So instead of looking up a fixed vector via a word, you **directly learn the vector that's most optimal for the task**. These vectors correspond to "virtual" tokens that don't exist in the vocabulary; every other weight in the model stays frozen, and only these virtual-token vectors get updated during training. It's like searching directly in vector space for the "magic incantation" that tells the model how to solve a specific task.
-   **(IA)³**: instead of weights, it learns scaling factors that modulate the model's internal *activations*, controlling the flow of information.

## Closing thoughts

LoRA is an impressive method that makes fine-tuning far more efficient and practical. It's not a silver bullet that guarantees the best performance in every scenario — but in most cases it's a powerful tool for working around resource constraints and still building the model you want.

Of course, it's important to be clear-eyed about LoRA's limitations and about the other PEFT methods out there, and to pick the approach that fits the task at hand. As a next step, I'm planning to actually benchmark some of LoRA's variants and other techniques against each other.
