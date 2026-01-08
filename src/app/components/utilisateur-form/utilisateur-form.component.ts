import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilisateurRequestDto } from '../../services/utilisateur.service';

@Component({
  selector: 'app-utilisateur-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './utilisateur-form.component.html',
  styleUrls: ['./utilisateur-form.component.css']
})
export class UtilisateurFormComponent implements OnInit {
  @Input() utilisateur?: any;
  @Output() onSubmit = new EventEmitter<UtilisateurRequestDto>();
  @Output() onCancel = new EventEmitter<void>();

  utilisateurForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isEditMode = !!this.utilisateur;
    this.initForm();
  }

  initForm(): void {
    this.utilisateurForm = this.fb.group({
      nom: [this.utilisateur?.nom || '', [Validators.required]],
      prenom: [this.utilisateur?.prenom || '', [Validators.required]],
      mail: [this.utilisateur?.mail || '', [Validators.required, Validators.email]],
      username: [this.utilisateur?.username || '', [Validators.required]],
      password: [this.utilisateur?.password || '', this.isEditMode ? [] : [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmitForm(): void {
    if (this.utilisateurForm.valid) {
      const formValue = this.utilisateurForm.value;

      const utilisateurData: UtilisateurRequestDto = {
        nom: formValue.nom,
        prenom: formValue.prenom,
        mail: formValue.mail,
        username: formValue.username,
        password: formValue.password || this.utilisateur?.password || ''
      };

      this.onSubmit.emit(utilisateurData);
    }
  }

  cancel(): void {
    this.onCancel.emit();
  }

  get f() {
    return this.utilisateurForm.controls;
  }
}
