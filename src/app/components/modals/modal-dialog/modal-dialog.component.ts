//* Este modal nos permitira crear o editar un candidato del sistema consumio la api para tal fin

import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormsModule } from '@angular/forms';
import { Candidate } from '../../../models/candidate';
import { CandidateService } from '../../services/candidate.service';
import { ToastrService } from 'ngx-toastr';
import { SharedServices } from '../../../shared-services/shared-services.service';
import {
  MAT_DIALOG_DATA
} from "@angular/material/dialog";


@Component({
  selector: 'app-modal-dialog',
  templateUrl: './modal-dialog.component.html',
  styleUrls: ['./modal-dialog.component.scss'],
  providers:[CandidateService]
})


export class ModalDialogComponent implements OnInit {
  public title:string;
  public button:string;
  public candidate:Candidate;
  constructor(
    private toastr: ToastrService,
    private _candidateService:CandidateService,
    private sharedServices:SharedServices,
  	public dialogRef: MatDialogRef<ModalDialogComponent>,

  	@Inject(MAT_DIALOG_DATA) public data: any
  )
   {
    if (data !== ''){
       this.candidate = data;
       this.title="Editar Candidato"
       this.button="Actualizar"
    }else{
      this.candidate = new Candidate('','','','',0,'',0);
      this.title="Crear Candidato"
      this.button="Crear"
    } 
    
   }

  ngOnInit() {
    
  }
  
  // consumimos api para edición o eliminación
  save(){
    if(this.candidate.id === ''){
      this._candidateService.saveCandidate(this.candidate).subscribe(
        response=>{
          if(response.status == 'OK'){
            this.toastr.success(response.message);
            this.sharedServices.sendCandidatesEvent();
            this.dialogRef.close();
          }else{
            this.toastr.error(response.message);
          } 
        },
        error=>{
          this.toastr.error("Falla en el sistema");
          console.log(error);
        }
      );
    }else{
       this._candidateService.updateCandidate(this.candidate).subscribe(
        response=>{
          if(response.status == 'OK'){
            this.toastr.success(response.message);
            this.sharedServices.sendCandidatesEvent();
            this.dialogRef.close();
          }else{
            this.toastr.error(response.message);
          } 
        },
        error=>{
          this.toastr.error("Falla en el sistema");
          console.log(error);
        }
      );   
    }
  }  

  close() {
    this.dialogRef.close();
  }

}
