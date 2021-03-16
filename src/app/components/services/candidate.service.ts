/*Aca listamos los servicios disponibles para consumo via API de las peticiones que se haga
 * para los procesos CRUD de la vista de Candidatos	
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError, retry } from 'rxjs/operators';
import { Candidate } from '../../models/candidate';
import { Global } from './global';

@Injectable({
  providedIn: 'root'
})

export class CandidateService{
	public url: string;

	constructor(
		private _http:HttpClient
	)
	{
		this.url =Global.url;
	}


	getCandidates():Observable<any>{
		let headers=new HttpHeaders().set('Content-Type','application/json');
		return this._http.get(this.url+'candidate/list',{headers:headers});
		
	}

	getCandidate(id):Observable<any>{
		let headers=new HttpHeaders().set('Content-Type','application/json');
		return this._http.post(this.url+'candidate/show/'+id,{headers:headers});
	}

	searchData(form):Observable<any>{
		let params=JSON.stringify(form);
		let headers=new HttpHeaders().set('Content-Type','application/json');
		return this._http.post(this.url+'candidate/search',params,{headers:headers});
	}

	saveCandidate(candidate: Candidate):Observable<any>{
		let params=JSON.stringify(candidate);
		let headers=new HttpHeaders().set('Content-Type','application/json');
		return this._http.post(this.url+'candidate/store',params,{headers:headers});
	}

	updateCandidate(candidate):Observable<any>{
		console.log(candidate.name);
		let params = JSON.stringify(candidate);
		let headers=new HttpHeaders().set('Content-Type','application/json');
		return this._http.put(this.url+'candidate/update/'+candidate.id,params,{headers:headers});
	}

	deleteCandidate(id):Observable<any>{
		let headers=new HttpHeaders().set('Content-Type','application/json');
		return this._http.delete(this.url+'candidate/delete/'+id,{headers:headers});
	}


}