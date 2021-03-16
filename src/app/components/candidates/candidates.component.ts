import { Component, OnInit, ViewChild } from '@angular/core';
import { Candidate } from '../../models/candidate';
import { CandidateService } from '../services/candidate.service';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalDialogComponent } from '../modals/modal-dialog/modal-dialog.component';
import { ModalConfirmComponent } from '../modals/modal-confirm/modal-confirm.component';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SharedServices } from '../../shared-services/shared-services.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.scss'], 
  providers:[CandidateService]
})

export class CandidatesComponent implements OnInit {
  //Busqueda Formulario
  public search:FormGroup;
  //Data Tables 
  public displayedColumns: string[] = ['name', 'surname', 'email','phone','date_of_interview','qualification','actions'];
  public dataSource: MatTableDataSource<Candidate>;
  //Modelo Candidate
  public candidates:Candidate[];
  public candidate:Candidate;
  //Event para actualizar Tabla
  public candidatesObserver:Subscription;

  //Paginadores
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(
      private fb: FormBuilder,
  		private _candidateService:CandidateService,
      private sharedService:SharedServices,
      private matDialog: MatDialog,
      private toastr: ToastrService,
    ){
       //Seteamos modelo con data en limpio
       this.candidate = new Candidate('','','','',0,'',0);
       //Obsevamos cambios en el listado
       this.candidatesObserver=this.sharedService.getCandidatesEvent().subscribe(()=>{
          this.getCandidates();
      });
    }

  //Creamos un nuevo usuario desde un modal
  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = "";
    let dialogRef = this.matDialog.open(ModalDialogComponent, dialogConfig);   
  }


  ngOnInit(){
    //Cargamos la información necesaria del usuario
    this.getCandidates();
    //Creamos un nuevo Formulario para la búsquda
     this.search = this.fb.group({
        name: [''],
        surname: [''],
        email: [''],
        date_start: [''],
        date_end: [''],
        qualification: [''],
    });
  }

  // Consumimos servicio de búsqueda
  searchData() {
    console.log(this.search.value);
    if( (this.search.value.date_start!=='' && this.search.value.date_start==='') ||
        (this.search.value.date_start ==='' && this.search.value.date_start !=='')
     ){
      this.toastr.error("Debe haber un rango de fechas verifique fecha de inicio y fecha final");
    }else{
      this._candidateService.searchData(this.search.value).subscribe(
        response=>{
          if(response.status == 'OK'){
            this.candidates = response.data;
            this.dataSource = new MatTableDataSource(this.candidates);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.toastr.success(response.message);
          }else{
            this.toastr.info(response.message);
          }  
        },
        error=>{
          this.toastr.error("Falla en el sistema");
          console.log(error);  
        }   
      );
    }      
  }

  //Consumimos servicio de listar candidatos actuales
  getCandidates(){
  	this._candidateService.getCandidates().subscribe(
  		response=>{
  			if(response.status == 'OK'){
	  			this.candidates = response.data;
          this.dataSource = new MatTableDataSource(this.candidates);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
	  		}	
  		},
  		error=>{
        
  			
  		}
  	)
  }

  //Consumimos api para ver información de un solo usuario
  getCandidate(id, origen){
    this._candidateService.getCandidate(id).subscribe(
      response=>{
        if(response.status == 'OK'){
          this.candidate.id = response.data.id;
          this.candidate.name = response.data.name;
          this.candidate.surname = response.data.surname;
          this.candidate.email = response.data.email;
          this.candidate.phone = response.data.phone;
          this.candidate.date_of_interview = response.data.date_of_interview;
          this.candidate.qualification = response.data.qualification;
          //Utilizamos mismo modal de creación para edición 
          if(origen == 'update'){
            const dialogConfig_edit = new MatDialogConfig();
            dialogConfig_edit.data = this.candidate;
            let dialogRef_edit = this.matDialog.open(ModalDialogComponent, dialogConfig_edit);  
            this.getCandidates();
          }
          // Llamamos modal para borrar el candidato 
          if(origen == 'delete'){
            const dialogConfig_delete = new MatDialogConfig();
            dialogConfig_delete.data = this.candidate;
            let dialogRef_delete = this.matDialog.open(ModalConfirmComponent, dialogConfig_delete);  
          } 
        } 
      },
      error=>{
        this.toastr.error("Falla en el sistema");
        console.log(error);  
      }
    )
  }

  //Recibimos id de candidato y se lo transmitimos al servicio para edición
  edit(id){
     this.getCandidate(id,'update'); 
  }

  //Recibimos id de candidato y se lo transmitimos al servicio para eliminación
  deleteCandidate(id){
    this.getCandidate(id,'delete'); 
  }


}
