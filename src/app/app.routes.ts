import { Routes } from '@angular/router';
import {InicioComponent} from './pages/inicio/inicio.component'
import {PruebasComponent} from './pages/pruebas/pruebas.component'
export const routes: Routes = [
    {
        path: '',
        component: InicioComponent
    },
    {
        path: 'pruebas',
        component: PruebasComponent
    }
];
