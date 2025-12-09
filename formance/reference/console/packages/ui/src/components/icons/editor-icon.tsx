import { ReactNode } from 'react';
import { AiFillFileText } from 'react-icons/ai';
import { FcFile } from 'react-icons/fc';
import {
  SiCss3,
  SiHtml5,
  SiJavascript,
  SiJson,
  SiTypescript,
} from 'react-icons/si';

function getEditorIconHelper() {
  const cache = new Map<string, ReactNode>();

  // Programming language icons for code editor
  cache.set('js', <SiJavascript color="#fbcb38" />);
  cache.set('jsx', <SiJavascript color="#fbcb38" />);
  cache.set('ts', <SiTypescript color="#378baa" />);
  cache.set('tsx', <SiTypescript color="#378baa" />);
  cache.set('css', <SiCss3 color="purple" />);
  cache.set('json', <SiJson color="#5656e6" />);
  cache.set('html', <SiHtml5 color="#e04e2c" />);
  cache.set('txt', <AiFillFileText color="white" />);

  function EditorIconSelector({
    extension,
    name,
  }: {
    extension: string;
    name: string;
  }): ReactNode {
    if (cache.has(extension)) return cache.get(extension);
    else if (cache.has(name)) return cache.get(name);
    else return <FcFile />;
  }

  return EditorIconSelector;
}

const EditorIcon = ({
  extension,
  name,
}: {
  extension: string;
  name: string;
}) => {
  const Icon = getEditorIconHelper();

  return <Icon extension={extension} name={name} />;
};

export default EditorIcon;
