import { createSvgIconFromRaw } from './base';

import usersSvg from './svg/users.svg?raw';
import userSvg from './svg/user.svg?raw';
import calendarSvg from './svg/calendar.svg?raw';
import flameSvg from './svg/flame.svg?raw';
import trendingUpSvg from './svg/trending-up.svg?raw';
import milestoneSvg from './svg/milestone.svg?raw';
import messageSquareSvg from './svg/message-square.svg?raw';
import columnsSvg from './svg/columns.svg?raw';
import alignJustifySvg from './svg/align-justify.svg?raw';
import tagSvg from './svg/tag.svg?raw';
import clockSvg from './svg/clock.svg?raw';

export const Users = createSvgIconFromRaw(usersSvg, 'Users');
export const User = createSvgIconFromRaw(userSvg, 'User');
export const Calendar = createSvgIconFromRaw(calendarSvg, 'Calendar');
export const Flame = createSvgIconFromRaw(flameSvg, 'Flame');
export const TrendingUp = createSvgIconFromRaw(trendingUpSvg, 'TrendingUp');
export const Milestone = createSvgIconFromRaw(milestoneSvg, 'Milestone');
export const MessageSquare = createSvgIconFromRaw(messageSquareSvg, 'MessageSquare');
export const Columns = createSvgIconFromRaw(columnsSvg, 'Columns');
export const AlignJustify = createSvgIconFromRaw(alignJustifySvg, 'AlignJustify');
export const Tag = createSvgIconFromRaw(tagSvg, 'Tag');
export const Clock = createSvgIconFromRaw(clockSvg, 'Clock');
