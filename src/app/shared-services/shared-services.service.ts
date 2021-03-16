// Este pequeña clase nos estará vigilando el listado de los candidatos cuando se hagan modificaciones
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})


export class SharedServices {

 private subject = new Subject<any>();

	sendCandidatesEvent() {
	  this.subject.next();
	}
    getCandidatesEvent(): Observable<any>{ 
	  return this.subject.asObservable();
	}

}
