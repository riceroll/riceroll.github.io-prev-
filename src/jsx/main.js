'use strict';

const e = React.createElement;

function renderElementWithID(id, elem) {
  ReactDOM.render(
    elem,
    document.querySelector('#' + id)
  )
}

function renderWithID(id, elemList) {
  ReactDOM.render(
    React.createElement(elemList[0], elemList[1], elemList[2]),
    document.querySelector('#' + id)
  )
}

const googleScholarLink = 'https://scholar.google.com/citations?user=ETjqnDsAAAAJ';
const cvLink = './files/cv.pdf';

renderWithID(
  "google-scholar",
  [
    'a',
    {
      href: googleScholarLink,
      style: {color: "black"}
    },
    '[Google Scholar]'
  ]
);

renderWithID(
  "cv",
  [
    'a',
    {
      href: cvLink,
      style: {color: "black"}
    },
    '[CV]'
  ]
);

function link(href, text) {
  return <a href={href}> {text} </a>;
}



// read & load projects.yaml

function project(props, uid) {
  const imageDir = `./media/projects/${props.projectName}/${props.imageName}`;
  const projectName = props.projectTitle;
  const projectDescription = ('projectDescription' in props)? props.projectDescription : "Coming soon.";

  const imageElement = <img className="img-fluid img-shadow" src={imageDir} style= { {maxHeight: "100%", maxWidth: "100%"} } />;
  const projectElement = (props.projectLink)? link(props.projectLink, "project") : "";
  const pdfElement = (props.pdfLink)? link(props.pdfLink, "PDF") : "";
  const doiElement = (props.doiLink)? link(props.doiLink, "DOI") : "";
  const videoElement = (props.videoLink)? link(props.videoLink, "video") : "";
  const codeElement = (props.codeLink)? link(props.codeLink, "code") : "";

  return  <div key={uid} className="row pt-4 pb-2" style={ {} }>
    {/*<div style={ {"background-image" : {url : {imageDir}} } }> </div>*/}
    <div className="col-sm-3 px-0" style={ {maxHeight : "inherit"} }>
      {imageElement}
    </div>
    <div className="col-sm-9 px-5">
      <div className="row">
        <div className="col project-name">
          {link(props.projectLink , projectName)}
        </div>
      </div>
      <div className="row">
        <div className="col my-2">
          {projectDescription}
        </div>
      </div>
      <div className="row">
        <div className="col">
          [{projectElement}]
          [{pdfElement}]
          [{doiElement}]
          [{videoElement}]
          [{codeElement}]
        </div>
      </div>
    </div>
  </div>;
}

let reader = new XMLHttpRequest();
reader.open("GET", "./files/projects.yaml", true);
reader.onreadystatechange = () => {
  if (reader.readyState === 4) {
    if (reader.status === 200 || reader.status === 0) {
      let text = reader.responseText;
      let data = jsyaml.load(text);

      let projects = [];
      for (let name in data) {
        let p = project(
          {
            projectName: name,
            imageName: data[name].imageName,
            projectTitle: data[name].projectTitle,
            projectLink: data[name].projectLink,
            pdfLink: data[name].pdfLink,
            doiLink: data[name].doiLink,
            videoLink: data[name].videoLink,
            codeLink: data[name].codeLink,
            projectDescription: data[name].projectDescription
          },
          projects.length
        );
        projects.push(p);
      }

      renderElementWithID(
        "projects",
        <div>
          {projects}
        </div>
      );

    }
  }
};
reader.send(null);





