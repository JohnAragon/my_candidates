//* Este modal nos permitira eliminar al usuario del sistema consumio la api para tal fin

import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { Candidate } from '../../../models/candidate';
import { CandidateService } from '../../services/candidate.service';
import { ToastrService } from 'ngx-toastr';
import { SharedServices } from '../../../shared-services/shared-services.service';
import {
  MAT_DIALOG_DATA
} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
  providers:[CandidateService]
})

export class ModalConfirmComponent implements OnInit {
  public candidate:Candidate;
  constructor(
    private toastr: ToastrService,
    private _candidateService:CandidateService,
    private sharedServices:SharedServices,
  	public dialogRef: MatDialogRef<ModalConfirmComponent>,
  	@Inject(MAT_DIALOG_DATA) public data: any
  )
   {
       this.candidate = data;
   } 

	ngOnInit() {
	  
	}
	//Consumo de api eliminación
	deleteCandidate(){
	   this._candidateService.deleteCandidate(this.candidate.id).subscribe(
	    response=>{
	      if(response.status == 'OK'){
	        this.toastr.success(response.message);
	        //Activamos event para eliminar del listado el usuario
	        this.sharedServices.sendCandidatesEvent();
	        this.dialogRef.close();
	      }else{
	        this.toastr.error(response.message);
	      } 
	    },
	    error=>{
	      console.log(error);
	    }
	  );   
	}
	  

	close() {
	  this.dialogRef.close();
	}
}


