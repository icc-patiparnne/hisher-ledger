import { FaGithub, FaGoogle, FaMicrosoft } from 'react-icons/fa';

type TIconName = 'github' | 'google' | 'microsoft';

type TReactIconProps = {
  name: TIconName;
  className?: string;
};

const IconMap = {
  github: FaGithub,
  google: FaGoogle,
  microsoft: FaMicrosoft,
};

const ReactIcon = ({ name, className }: TReactIconProps) => {
  const Icon = IconMap[name];

  return <Icon className={className} />;
};

export default ReactIcon;
