import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../data/services/profile.service';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  profileService = inject(ProfileService);

  ngOnInit() {
    console.log('ng on init');
    this.profileService.getMe().subscribe((val) => {
      console.log(val);
    });
  }
}
