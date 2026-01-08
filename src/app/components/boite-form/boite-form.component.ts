import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BoiteRequestDto } from '../../services/boite.service';

@Component({
  selector: 'app-boite-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './boite-form.component.html',
  styleUrls: ['./boite-form.component.css']
})
export class BoiteFormComponent implements OnInit {
  @Input() boite?: any;
  @Output() onSubmit = new EventEmitter<BoiteRequestDto>();
  @Output() onCancel = new EventEmitter<void>();

  boiteForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.isEditMode = !!this.boite;
    this.initForm();
  }

  initForm(): void {
    this.boiteForm = this.fb.group({
      nom: [this.boite?.nom || '', [Validators.required]],
      description: [this.boite?.description || ''],
      quantite: [this.boite?.quantite || 0, [Validators.required, Validators.min(0)]],
      latitude: [this.boite?.coordonnees?.latitude ?? this.boite?.latitude ?? '', Validators.required],
      longitude: [this.boite?.coordonnees?.longitude ?? this.boite?.longitude ?? '', Validators.required],

    });
  }

  onSubmitForm(): void {
  if (this.boiteForm.valid) {
    const formValue = this.boiteForm.value;
    
    const boiteData: BoiteRequestDto = {
      nom: formValue.nom,
      description: formValue.description,
      quantite: formValue.quantite,
      latitude: formValue.latitude,    
      longitude: formValue.longitude,
    };

    this.onSubmit.emit(boiteData);
  }
}

  cancel(): void {
    this.onCancel.emit();
  }

  get f() {
    return this.boiteForm.controls;
  }
}