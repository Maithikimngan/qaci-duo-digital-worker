---
name: learn-domain-knowledge
title: Learn a data domain fast
description: Get an ML researcher productive in an unfamiliar data domain (X-ray, ECG, CT, EHR, clinical notes and similar) by explaining how the data is produced, labelled and evaluated, and turning that into model-design decisions.
triggers: learn the domain, domain knowledge, medical data, ECG, X-ray, CT, EHR, clinical notes, SOAP notes, explain this data
tags: research, domain, medical
license: MIT
author: QACI
---

# Learn a data domain fast

Gives a researcher the domain knowledge they need to design a sound model: how the data is created, what the labels really mean, which metrics practitioners trust, and the traps that make results look better than they are.

## When to use

- Starting a project on a data type the user has not worked with.
- Results look suspiciously good or bad and domain effects may explain why.
- Preparing questions for a meeting with a domain expert.
- **Not for:** clinical advice or interpreting an individual patient's data.

## Inputs

| Input | Required | Notes |
|---|---|---|
| Task | yes | What the model should predict or produce |
| Data type and source | yes | For example "12-lead ECG from PTB-XL", "chest X-ray from a partner hospital" |
| Who uses the output | no | Clinician, technician, researcher, patient; changes which errors matter |
| Constraints | no | Compute, label budget, deployment setting |

## Procedure

1. **How the data is produced.** Explain the device or workflow, who records it, when, and why it is recorded in routine practice.
   - *Check:* name at least one way the recording process could leak the label (for example, a test ordered only when a disease is suspected).
2. **Format and structure.** Describe the file formats (DICOM, WFDB, FHIR, free text), sampling rates or resolutions, and the internal structure (ECG leads, imaging views, note sections such as Subjective/Objective/Assessment/Plan).
3. **Public datasets.** List the common datasets with size, licence, access process, label source and who labelled them.
   - *Check:* each dataset has a link and its access requirements (credentialed access, data-use agreement).
4. **Labels and their noise.** Explain how labels are produced (expert annotation, billing codes, report mining), their known error rates, and inter-rater agreement where published.
5. **Metrics practitioners trust.** For the task, list the metrics used in the field (AUROC, sensitivity at fixed specificity, Dice, per-class F1, calibration) and explain why accuracy can mislead under class imbalance.
6. **Traps.** Go through the usual failure modes and say which apply:
   - leakage when splits are not made by patient;
   - class imbalance and rare but critical classes;
   - shortcuts (scanner markers, hospital codes, text templates);
   - distribution shift across sites, devices and time;
   - label definitions that differ between datasets.
7. **Design decisions.** Turn the above into concrete choices: inputs, preprocessing, a minimum baseline, the split strategy, the metrics to report.
8. **Expert questions.** Write the questions only a domain expert can answer.

## Output

```markdown
## Domain brief: <data type> for <task>

<Three sentences: what the data is, the main trap, the recommended setup.>

### How the data is made
### Formats and structure
### Datasets
| Dataset | Size | Labels (by whom) | Licence / access | Link |
|---|---|---|---|---|

### Labels and noise
### Metrics to report
### Traps that apply here
### Design decisions
| Domain fact | Decision |
|---|---|

### Questions for a domain expert
### Further reading
```

## Quality checklist

- [ ] Every dataset and claim about labels has a source.
- [ ] The split strategy explicitly prevents patient-level leakage.
- [ ] General knowledge that needs expert confirmation is marked as such.

## Guardrails

- **Never:** give diagnostic or treatment advice.
- **Never:** ask for or accept identifiable patient data in chat; work with public data or de-identified summaries.
- **Ask first:** before recommending a dataset that needs credentialed access, confirm the user can obtain it.

## Example

**Request:** "I'm an NLP person starting on SOAP notes for diagnosis prediction. What do I need to know?"

**Response outline:** how SOAP notes are written and copied forward, MIMIC note access requirements, why the Assessment section leaks the diagnosis, metrics per diagnosis group, a split by patient and admission, and questions for a clinician about which sections are reliable.
