export const exampleTemplate = String.raw`
\documentclass[10pt, letterpaper]{article}

% Packages:
\usepackage[
    ignoreheadfoot, % set margins without considering header and footer
    top=2 cm, % seperation between body and page edge from the top
    bottom=2 cm, % seperation between body and page edge from the bottom
    left=2 cm, % seperation between body and page edge from the left
    right=2 cm, % seperation between body and page edge from the right
    footskip=1.0 cm, % seperation between body and footer
    % showframe % for debugging 
]{geometry} % for adjusting page geometry
\usepackage{titlesec} % for customizing section titles
\usepackage{tabularx} % for making tables with fixed width columns
\usepackage{array} % tabularx requires this
\usepackage[dvipsnames]{xcolor} % for coloring text
\definecolor{primaryColor}{RGB}{0, 0, 0} % define primary color
\usepackage{enumitem} % for customizing lists
\usepackage{fontawesome5} % for using icons
\usepackage{amsmath} % for math
\usepackage[
    pdftitle={Resume - {{full_name}} },
    pdfauthor={ {{full_name}} },
    pdfcreator={LaTeX with RenderCV},
    colorlinks=true,
    urlcolor=primaryColor
]{hyperref} % for links, metadata and bookmarks
\usepackage[pscoord]{eso-pic} % for floating text on the page
\usepackage{calc} % for calculating lengths
\usepackage{bookmark} % for bookmarks
\usepackage{lastpage} % for getting the total number of pages
\usepackage{changepage} % for one column entries (adjustwidth environment)
\usepackage{paracol} % for two and three column entries
\usepackage{ifthen} % for conditional statements
\usepackage{needspace} % for avoiding page brake right after the section title
\usepackage{iftex} % check if engine is pdflatex, xetex or luatex

% Ensure that generate pdf is machine readable/ATS parsable:
\ifPDFTeX
    \input{glyphtounicode}
    \pdfgentounicode=1
    \usepackage[T1]{fontenc}
    \usepackage[utf8]{inputenc}
    \usepackage{lmodern}
\fi

\usepackage{charter}

% Some settings:
\raggedright
\AtBeginEnvironment{adjustwidth}{\partopsep0pt} % remove space before adjustwidth environment
\pagestyle{empty} % no header or footer
\setcounter{secnumdepth}{0} % no section numbering
\setlength{\parindent}{0pt} % no indentation
\setlength{\topskip}{0pt} % no top skip
\setlength{\columnsep}{0.15cm} % set column seperation
\pagenumbering{gobble} % no page numbering

\titleformat{\section}{\needspace{4\baselineskip}\bfseries\large}{}{0pt}{}[\vspace{1pt}\titlerule]

\titlespacing{\section}{
    % left space:
    -1pt
}{
    % top space:
    0.3 cm
}{
    % bottom space:
    0.2 cm
} % section title spacing

\renewcommand\labelitemi{$\vcenter{\hbox{\small$\bullet$}}$} % custom bullet points
\newenvironment{highlights}{
    \begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=0 cm + 10pt
    ]
}{
    \end{itemize}
} % new environment for highlights


\newenvironment{highlightsforbulletentries}{
    \begin{itemize}[
        topsep=0.10 cm,
        parsep=0.10 cm,
        partopsep=0pt,
        itemsep=0pt,
        leftmargin=10pt
    ]
}{
    \end{itemize}
} % new environment for highlights for bullet entries

\newenvironment{onecolentry}{
    \begin{adjustwidth}{
        0 cm + 0.00001 cm
    }{
        0 cm + 0.00001 cm
    }
}{
    \end{adjustwidth}
} % new environment for one column entries

\newenvironment{twocolentry}[2][]{
    \onecolentry
    \def\secondColumn{ #2}
    \setcolumnwidth{\fill, 4.5 cm}
    \begin{paracol}{2}
}{
    \switchcolumn \raggedleft \secondColumn
    \end{paracol}
    \endonecolentry
} % new environment for two column entries

\newenvironment{threecolentry}[3][]{
    \onecolentry
    \def\thirdColumn{ #3}
    \setcolumnwidth{, \fill, 4.5 cm}
    \begin{paracol}{3}
    {\raggedright #2} \switchcolumn
}{
    \switchcolumn \raggedleft \thirdColumn
    \end{paracol}
    \endonecolentry
} % new environment for three column entries

\newenvironment{header}{
    \setlength{\topsep}{0pt}\par\kern\topsep\centering\linespread{1.5}
}{
    \par\kern\topsep
} % new environment for the header

\newcommand{\placelastupdatedtext}{
  \AddToShipoutPictureFG*{
    \put(
        \LenToUnit{\paperwidth-2 cm-0 cm+0.05cm},
        \LenToUnit{\paperheight-1.0 cm}
    ){\vtop{ { \null}\makebox[0pt][c]{
        \small\color{gray}\textit{Last updated in September 2024}\hspace{\widthof{Last updated in September 2024}}
    }}}%
  }%
}%
\let\hrefWithoutArrow\href

\begin{document}
    \newcommand{\AND}{\unskip
        \cleaders\copy\ANDbox\hskip\wd\ANDbox
        \ignorespaces
    }
    \newsavebox\ANDbox
    \sbox\ANDbox{$|$}

    \begin{header}
        \fontsize{25 pt}{25 pt}\selectfont {{full_name}}%

        \vspace{5 pt}

        \normalsize
        \mbox{ {{ location }} }%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{mailto:{{ email }}}{ {{ email }} }}%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{tel:{{ phone }}}{ {{ phone }} }}%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{https://{{ website }}}{ {{ website }} }}%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{https://{{ linkedin }}}{ {{ linkedin }} }}%
        \kern 5.0 pt%
        \AND%
        \kern 5.0 pt%
        \mbox{\hrefWithoutArrow{https://{{ github }}}{ {{ github }} }}%
    \end{header}

    \vspace{5 pt - 0.3 cm}


    \section{Summary}

        
        \begin{onecolentry}
            {{summary}}
        \end{onecolentry}


    \section{Technologies}
    {% for skill_category in skills %}
        \begin{onecolentry}
        \textbf{ {{ skill_category.category }}: } {% for skill in skill_category.skills %}{{ skill }}{% if not loop.last %}, {% endif %}{% endfor %}
        \end{onecolentry}

        \vspace{0.2 cm}
    {% endfor %}
    
    \section{Experience}
        
    {% for experience_entry in experience %}
        \begin{twocolentry}{
            {{ experience_entry.start_date }} – {{ experience_entry.end_date }}
        }
            \textbf{ {{ experience_entry.job_title }}, {{ experience_entry.company }} }
        \end{twocolentry}

        \vspace{0.10 cm}
        \begin{onecolentry}
            \begin{highlights}
                {% for responsibility in experience_entry.responsibilities %}
                    \item {{ responsibility }}
                {% endfor %}
            \end{highlights}
        \end{onecolentry}
        {% if not loop.last %}
        \vspace{0.2 cm}
        {% endif %}

    {% endfor %}

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
    
    \section{Side Projects}

    {% for project in side_projects %}
        
        \textbf{ {{ project.name }} }
        
        \vspace{0.10 cm}
        \begin{onecolentry}
            \begin{highlights}
                {% for responsibility in project.responsibilities %}
                    \item {{ responsibility }}
                {% endfor %}
            \end{highlights}
        \end{onecolentry}
    {% endfor %}


    \section{Languages}


    \begin{onecolentry}
        \begin{highlightsforbulletentries}
        {% for language in languages %}
            \item {{ language.language }} ({{ language.proficiency }})
        {% endfor %}
        \end{highlightsforbulletentries}
    \end{onecolentry}


   \vspace{32pt}
    
   \textit{ {{ data_processing_consent }} }

\end{document}
`

export const exampleData = {
  metadata: {
    last_modified: "2025-07-20T12:00:00Z",
  },
  full_name: "John Doe",
  email: "john.doe@example.com",
  phone: "+48 123 456 789",
  location: "Poznań, Poland",
  website: "john.doe.example.com",
  linkedin: "linkedin.com/in/johndoe",
  github: "github.com/johndoe",
  summary:
    "Fullstack Developer with 3 years of experience building end-to-end web applications for government and enterprise clients. Passionate about improving real-world processes through technology. Skilled in optimizing workflows, increasing operational efficiency, and delivering impactful digital products",
  skills: [
    {
      category: "Languages",
      skills: [
        "JavaScript",
        "TypeScript",
        "Python",
        "Go",
        "SQL",
        "HTML",
        "CSS",
      ],
    },
    {
      category: "Frameworks",
      skills: ["React", "Vue", "Nuxt", "Angular", "Express.js", "NestJS"],
    },
    {
      category: "Databases",
      skills: ["PostgreSQL", "MariaDB", "MySQL", "ArangoDB"],
    },
    {
      category: "Platforms \\& Tools",
      skills: [
        "Node.js",
        "Git",
        "Docker",
        "Ansible",
        "GCP",
        "Terraform",
        "Github Actions",
        "Github Copilot",
        "OR-Tools",
      ],
    },
  ],
  experience: [
    {
      job_title: "Fullstack Developer",
      company: "Example Company",
      start_date: "Mar 2023",
      end_date: "Present",
      responsibilities: [
        "Delivered a government back-office application under difficult project management conditions, ensuring on-time delivery and daily use by multiple departments.",
        "Developed a work time registry system used by 600 employees daily, replacing inefficient paper-based time reporting and reducing administrative load.",
        "Built and deployed a parking and hot desk reservation platform, facilitating smoother hybrid work transitions, boosting office attendance rates and resulting in significant cost savings for the company.",
        "Created a project staffing tool that improved management’s ability to allocate employees to projects, improving visibility and planning.",
        "Currently leading the development of a custom LIMS + CRM platform for laboratory process digitization, replacing critical manual workflows.",
      ],
    },
    {
      job_title: "ERP Intern Consultant",
      company: "Example Company 2",
      start_date: "Nov 2021",
      end_date: "Nov 2022",
      responsibilities: [
        "Developed Microsoft 365 Nav/Business Central custom modules in C/AL language.",
        "Worked on international projects and troubleshooted customer’s problems with accounting processes.",
      ],
    },
  ],
  education: [
    {
      degree: "BSc in Computer Science",
      institution: "Example University",
      start_date: "Oct 2019",
      end_date: "Apr 2023",
    },
  ],
  side_projects: [
    {
      name: "Example Project",
      responsibilities: [
        "Co-developed an algorithm for generative shift-based work scheduling, reducing a 10-hour manual task to 1 minute of automated computation",
        "Used Google OR-Tools, constraint programming, Vue, Django",
      ],
      url: "",
    },
  ],
  languages: [
    {
      language: "Polish",
      proficiency: "Native",
    },
    {
      language: "English",
      proficiency: "Fluent",
    },
  ],
  data_processing_consent:
    "I hereby give consent for my personal data to be processed for recruitment purposes by the entity to which I am submitting my application, in accordance with applicable data protection regulations.",
};
