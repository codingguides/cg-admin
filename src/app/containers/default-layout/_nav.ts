import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    // badge: {
    //   color: 'info',
    //   text: 'NEW'
    // }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Topic',
    url: '/topic',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Topic List',
        url: '/topic/list'
      }
    ]
  }
];