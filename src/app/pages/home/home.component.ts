import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService, Digimon } from '../../servicios/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  digimons: Digimon[] = [];
  filteredDigimons: Digimon[] = [];
  isLoading: boolean = true;
  searchTerm: string = '';

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadDigimons();
  }

  loadDigimons(): void {
    this.isLoading = true;
    this.dataService.getDigimons().subscribe({
      next: (data: Digimon[]) => {
        this.digimons = data;
        this.filteredDigimons = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar digimons:', err);
        this.isLoading = false;
      }
    });
  }

  filterDigimons(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredDigimons = this.digimons;
    } else {
      this.filteredDigimons = this.digimons.filter(d =>
        d.name.toLowerCase().includes(term) ||
        d.level.toLowerCase().includes(term)
      );
    }
  }

  goToDetail(digimon: Digimon): void {
    this.router.navigate(['/detail', digimon.name], {
      state: { digimon }
    });
  }

  doRefresh(event: any): void {
    this.searchTerm = '';
    this.dataService.getDigimons().subscribe({
      next: (data: Digimon[]) => {
        this.digimons = data;
        this.filteredDigimons = data;
        event.target.complete();
      },
      error: () => {
        event.target.complete();
      }
    });
  }

  getLevelColor(level: string): string {
    const colors: { [key: string]: string } = {
      'Fresh': 'success',
      'In Training': 'tertiary',
      'Rookie': 'primary',
      'Champion': 'warning',
      'Ultimate': 'danger',
      'Mega': 'dark',
      'Ultra': 'medium',
      'Armor': 'secondary'
    };
    return colors[level] || 'medium';
  }
}
