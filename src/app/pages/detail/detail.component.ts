import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Digimon } from '../../servicios/data.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {
  digimon: Digimon | null = null;
  digimonName: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener parámetro de la ruta
    this.digimonName = this.route.snapshot.paramMap.get('name') || '';
    
    // Obtener el estado pasado por navegación
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['digimon']) {
      this.digimon = navigation.extras.state['digimon'] as Digimon;
    } else {
      // Si se accede directamente via URL, recuperar del historial
      const state = history.state;
      if (state?.digimon) {
        this.digimon = state.digimon as Digimon;
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
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

  getLevelDescription(level: string): string {
    const descriptions: { [key: string]: string } = {
      'Fresh': 'Recién nacido, forma más básica del Digimon.',
      'In Training': 'En entrenamiento, comenzando su evolución.',
      'Rookie': 'Novato, forma inicial más común y estable.',
      'Champion': 'Campeón, forma intermedia con gran poder.',
      'Ultimate': 'Último, extremadamente poderoso y avanzado.',
      'Mega': 'Mega, la forma más poderosa alcanzable.',
      'Ultra': 'Ultra, poder más allá de los límites conocidos.',
      'Armor': 'Armadura, evolución especial mediante la armadura.'
    };
    return descriptions[level] || 'Nivel de evolución especial.';
  }
}
