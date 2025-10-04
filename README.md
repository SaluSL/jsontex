# jsontex

Tool for converting [LaTeX](https://www.latex-project.org/) templates with JSON data to PDF documents.

You can use it to fill [jinja](https://github.com/pallets/jinja) placeholders with your data and create loops in your templates.

Check out the [demo app](https://jsontex-demo-app-836808471381.europe-central2.run.app/)

## example

LaTeX template

```python
\section{Education}

{% for education_entry in education %}
    \begin{twocolentry}{
        {{ education_entry.start_date }} – {{ education_entry.end_date }}
    }
        \textbf{ {{ education_entry.degree }}}, {{ education_entry.institution }}
    \end{twocolentry}

    {% if education_entry.description %}
        \vspace{0.10 cm}
        \begin{onecolentry}
            {{ education_entry.description }}
        \end{onecolentry}
    {% endif %}

{% endfor %}
```

JSON data source

```JSON
{
  "education": [
    {
      "degree": "BSc in Computer Science",
      "institution": "Example University",
      "start_date": "Oct 2019",
      "end_date": "Apr 2023"
    },
    ...
  ]
}
```

## usage

To use it, you will need to use the `jsontex` docker image:

```yaml
version: "3"
services:
  jsontex:
    image: ghcr.io/salusl/jsontex:latest
    ports:
      - "8000:8000"
    environment: # set CORS settings if you want to call jsontex from a different origin in browser
      - CORS_ALLOW_ORIGINS=["http://localhost:3000"]
      - CORS_ALLOW_CREDENTIALS=0
      - CORS_ALLOW_METHODS=["*"]
      - CORS_ALLOW_HEADERS=["*"]
```

You need to call the API service at `/render/LaTeX` with a POST request with the following body:

```json
{
    "template": "...", // LaTeX template in Base64 encoded string
    "data": {...} // your JSON data source
}
```

It will return a file with application/pdf MIME type.

You can refer to swagger docs at `/docs`.
