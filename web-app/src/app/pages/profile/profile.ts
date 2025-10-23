import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/select';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-profile',
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatLabel,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  authService = inject(AuthService);
  profileForm!: FormGroup;
  fb = inject(FormBuilder);

  ngOnInit() {
    this.profileForm = this.fb.group({
      profileImage: [''],
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      salery: []
    });

    this.authService.getProfile().subscribe((result : any) => {
      console.log(result);
      this.profileForm.patchValue(result);
      this.imageSrc = result.profileImage;
    });
  }

  imageSrc: string = '';
  fileUpload(event: Event) {
    var target: any = event.target;
    if (target.files && target.files[0]) {
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.imageSrc = reader.result as string;
        this.profileForm.patchValue({
          profileImage: this.imageSrc,
        });
        console.log(this.imageSrc);
      };
      reader.readAsDataURL(file);
    }
  }

  Update() {
    this.authService.updateProfile(this.profileForm.value).subscribe((res) => {
      alert('Profile Updated Successfully');
    });
  }
}
