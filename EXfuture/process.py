import sys
import re
import os

iDir = sys.argv[1]
fileName = iDir.split('/')[-1].split('.')[0]
folder = iDir.split('/')[:-1] + ['LinkedIn_files']

with open(iDir) as ifile:
  content = ifile.read()

pattern = 'rel="stylesheet" href="(.*?)"'
csss = re.findall(pattern, content)

for css in csss:
  content = content.replace(css, css+".css")

cssNames = [css.split('/')[-1] for css in csss]

for cssFile in os.listdir('/'+os.path.join(*(folder))):
  fileToRename = '/'+os.path.join(*(folder + [cssFile]))
  newName = '/'+os.path.join(*(folder + [cssFile+'.css']))
  if cssFile in cssNames:
    os.rename(fileToRename, newName)

pattern = '(<script.*?/script>)'
csss = re.findall(pattern, content)
for css in csss:
  content = content.replace(css, "")

with open(iDir, 'w') as ofile:
  ofile.write(content)


