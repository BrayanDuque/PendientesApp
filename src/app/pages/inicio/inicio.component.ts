import { CommonModule } from '@angular/common';
import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { tarea } from '../../models/tarea.models';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  tareas = signal<tarea[]>([]);

  filter = signal('Todos')
  filtrandoTareas = computed(()=>{
    const filter = this.filter();
    const tareas = this.tareas();
    if(filter === 'Pendientes'){
      return tareas.filter(tarea => !tarea.completed)
    }
    if(filter === 'Completado'){
      return tareas.filter(tarea => tarea.completed)
    }
    return tareas
  })

//se crea una instancia para validaciones en los inputs 
  nuevasTareas = new FormControl('', {
    //no acepte valores nulos
    nonNullable: true,
    //validadores
    validators: [
      //esto valida de que el valor sea requerido u obligatorio 
      Validators.required,
    ]
  })


injector = inject(Injector)
  ngOnInit() {
    const storage = localStorage.getItem('tareas');
    if(storage){
      const tareas = JSON.parse(storage);
      this.tareas.set(tareas)
    }
    this.trakearTareas()
  }

  trakearTareas (){
    effect(()=>{
      const tareas = this.tareas();
      localStorage.setItem('tareas', JSON.stringify(tareas))
    },{injector: this.injector})
  }

  cambiosControlador(){
    //preguntamos si el valor es valido
   if(this.nuevasTareas.valid){
    //si es true el valor se guardara en la variable
    const value = this.nuevasTareas.value.trim()
    //se añade el valor al metodo 
    this.agregarTarea(value);
    //se le indica que deje el input en vacio
    this.nuevasTareas.setValue('')
   }
    

  };

  agregarTarea(titulo : string){
    const nuevaTarea = {
      id : Date.now(),
      titulo,
      completed: false
    }
    this.tareas.update((tareas)=> [...tareas, nuevaTarea])
  }
  eliminarTarea (index:number){
    this.tareas.update((tareas)=> tareas.filter((tarea, posicion)=> posicion !== index))
  } 
    
  aceptarTarea(tarea: tarea) {
    tarea.completed = !tarea.completed;
  }
  modoEdicion(index:number){
      this.tareas.update(prevState =>{
        return prevState.map((tarea, position)=>{
          if(position === index){
            return{
              ...tarea, edition: true
            }
          }
          return {
            ...tarea, edition: false
          }
        })
      })
  }
  modoEdicionTexto(index:number, event: Event){
    const input = event.target as HTMLInputElement;
    this.tareas.update(prevState =>{
      return prevState.map((tarea, position)=>{
        if(position === index){
          return{
            ...tarea, 
            titulo: input.value,
            edition:false
          }
        }
        return tarea;
      })
    })
}
cambiosfiltro(filter: string){
  this.filter.set(filter)
}
}
