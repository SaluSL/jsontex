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
