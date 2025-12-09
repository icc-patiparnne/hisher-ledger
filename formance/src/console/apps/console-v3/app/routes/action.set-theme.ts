import { ActionFunction } from 'react-router';
import { createThemeAction } from 'remix-themes';

import { themeSessionResolver } from '../utils/session.theme.server';

export const action: ActionFunction = createThemeAction(themeSessionResolver);
