'use strict';

var e = React.createElement;

function renderElementWithID(id, elem) {
  ReactDOM.render(elem, document.querySelector('#' + id));
}

function renderWithID(id, elemList) {
  ReactDOM.render(React.createElement(elemList[0], elemList[1], elemList[2]), document.querySelector('#' + id));
}

var googleScholarLink = 'https://scholar.google.com/citations?user=ETjqnDsAAAAJ';
var cvLink = './files/CV.pdf';

renderWithID("google-scholar", ['a', {
  href: googleScholarLink,
  style: { color: "black" }
}, '[Google Scholar]']);

renderWithID("cv", ['a', {
  href: cvLink,
  style: { color: "black" }
}, '[CV]']);

function link(href, text) {
  return React.createElement(
    'a',
    { href: href },
    ' ',
    text,
    ' '
  );
}

// read & load projects.yaml

function project(props, uid) {
  var imageDir = './media/projects/' + props.projectName + '/' + props.imageName;
  var projectName = props.projectTitle;
  var projectDescription = 'projectDescription' in props ? props.projectDescription : "Coming soon.";

  var imageElement = React.createElement('img', { className: 'img-fluid img-shadow', src: imageDir, style: { maxHeight: "100%", maxWidth: "100%" } });
  var projectElement = props.projectLink ? link(props.projectLink, "project") : "";
  var pdfElement = props.pdfLink ? link(props.pdfLink, "PDF") : "";
  var doiElement = props.doiLink ? link(props.doiLink, "DOI") : "";
  var videoElement = props.videoLink ? link(props.videoLink, "video") : "";
  var codeElement = props.codeLink ? link(props.codeLink, "code") : "";

  return React.createElement(
    'div',
    { key: uid, className: 'row pt-4 pb-2', style: {} },
    React.createElement(
      'div',
      { className: 'col-sm-3 px-0', style: { maxHeight: "inherit" } },
      imageElement
    ),
    React.createElement(
      'div',
      { className: 'col-sm-9 px-5' },
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col project-name' },
          link(props.projectLink, projectName)
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col my-2' },
          projectDescription
        )
      ),
      React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col' },
          '[',
          projectElement,
          '] [',
          pdfElement,
          '] [',
          doiElement,
          '] [',
          videoElement,
          '] [',
          codeElement,
          ']'
        )
      )
    )
  );
}

var reader = new XMLHttpRequest();
reader.open("GET", "./files/projects.yaml", true);
reader.onreadystatechange = function () {
  if (reader.readyState === 4) {
    if (reader.status === 200 || reader.status === 0) {
      var text = reader.responseText;
      var data = jsyaml.load(text);

      var projects = [];
      for (var name in data) {
        var p = project({
          projectName: name,
          imageName: data[name].imageName,
          projectTitle: data[name].projectTitle,
          projectLink: data[name].projectLink,
          pdfLink: data[name].pdfLink,
          doiLink: data[name].doiLink,
          videoLink: data[name].videoLink,
          codeLink: data[name].codeLink,
          projectDescription: data[name].projectDescription
        }, projects.length);
        projects.push(p);
      }

      renderElementWithID("projects", React.createElement(
        'div',
        null,
        projects
      ));
    }
  }
};
reader.send(null);