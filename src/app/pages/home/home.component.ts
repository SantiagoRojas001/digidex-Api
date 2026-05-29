import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DataService, Digimon, DigimonDetail } from '../../servicios/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  digimons: Digimon[] = [];
  filteredDigimons: Digimon[] = [];
  isLoading = true;
  searchTerm = '';
  flippedCards = new Set<number>();
  detailCache: { [id: number]: DigimonDetail } = {};

  constructor(private dataService: DataService, private router: Router) {}

  ngOnInit(): void {
    this.loadDigimons();
  }

  loadDigimons(): void {
    this.isLoading = true;
    this.dataService.getDigimons().subscribe({
      next: (data) => {
        this.digimons = data;
        this.filteredDigimons = data;
        this.isLoading = false;
        this.precargarDetalles(data);
      },
      error: (err) => {
        console.error('Error al cargar digimons:', err);
        this.isLoading = false;
      }
    });
  }

  private precargarDetalles(lista: Digimon[]): void {
    from(lista).pipe(
      mergeMap(d => this.dataService.getDigimonDetail(d.id), 5)
    ).subscribe({
      next: (detail) => {
        this.detailCache = { ...this.detailCache, [detail.id]: detail };
      },
      error: () => {}
    });
  }

  filterDigimons(): void {
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredDigimons = !term
      ? this.digimons
      : this.digimons.filter(d => d.name.toLowerCase().includes(term));
  }

  flipCard(digimon: Digimon): void {
    const next = new Set(this.flippedCards);
    if (next.has(digimon.id)) {
      next.delete(digimon.id);
    } else {
      next.add(digimon.id);
    }
    this.flippedCards = next;
  }

  goToDetail(event: Event, digimon: Digimon): void {
    event.stopPropagation();
    const cached = this.detailCache[digimon.id];
    const level = cached?.levels[0]?.level || 'Unknown';
    this.router.navigate(['/detail', digimon.name], {
      state: { digimon: { ...digimon, level } }
    });
  }

  doRefresh(event: any): void {
    this.searchTerm = '';
    this.flippedCards = new Set<number>();
    this.detailCache = {};
    this.dataService.getDigimons().subscribe({
      next: (data) => {
        this.digimons = data;
        this.filteredDigimons = data;
        event.target.complete();
        this.precargarDetalles(data);
      },
      error: () => event.target.complete()
    });
  }

  getTypesString(detail: DigimonDetail): string {
    return detail.types.map(t => t.type).join(', ') || 'N/A';
  }

  getLevel(detail: DigimonDetail): string {
    return detail.levels[0]?.level || 'N/A';
  }

  getAttribute(detail: DigimonDetail): string {
    return detail.attributes[0]?.attribute || 'N/A';
  }

  getLevelClass(id: number): string {
    const level = this.detailCache[id]?.levels[0]?.level;
    if (!level) return 'level-unknown';
    return 'level-' + level.toLowerCase().replace(/ /g, '-');
  }

  getLevelText(id: number): string {
    return this.detailCache[id]?.levels[0]?.level || '???';
  }
}
