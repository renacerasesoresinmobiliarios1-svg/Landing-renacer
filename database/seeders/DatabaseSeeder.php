<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Lead;
use App\Models\WhatsAppLog;
use App\Models\Favorite;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Usuarios con roles (Admin, Vendedor, Cliente) y contraseñas con Hash::make
        $admin = User::updateOrCreate(
            ['email' => 'jorge@renacer.com'],
            [
                'name' => 'Jorge (Director Admin)',
                'role' => 'admin',
                'telefono' => '526141234567',
                'password' => Hash::make('admin123'),
            ]
        );

        $vendedor = User::updateOrCreate(
            ['email' => 'asesor@renacer.com'],
            [
                'name' => 'Carlos Mendoza (Asesor)',
                'role' => 'vendedor',
                'telefono' => '526149988776',
                'password' => Hash::make('asesor123'),
            ]
        );

        $vendedor2 = User::updateOrCreate(
            ['email' => 'mariana@renacer.com'],
            [
                'name' => 'Mariana Ruiz (Asesora GDL)',
                'role' => 'vendedor',
                'telefono' => '523311223344',
                'password' => Hash::make('asesor123'),
            ]
        );

        $cliente = User::updateOrCreate(
            ['email' => 'cliente@renacer.com'],
            [
                'name' => 'Ana Laura García (Cliente)',
                'role' => 'cliente',
                'telefono' => '526145554433',
                'password' => Hash::make('cliente123'),
            ]
        );

        // 2. Propiedades con especificaciones inmobiliarias completas
        $propertiesData = [
            [
                'titulo' => 'Residencia Contemporánea en Distrito Uno',
                'ubicacion' => 'Distrito Uno, Chihuahua, Chih.',
                'ciudad' => 'Chihuahua',
                'tipo' => 'Venta',
                'precio' => 6850000.00,
                'precio_texto' => '$6,850,000 MXN',
                'costo_base' => 6350000.00,
                'utilidad' => 500000.00,
                'estatus' => 'Activo',
                'habitaciones' => 3,
                'recamaras' => 3,
                'banos' => 3.5,
                'estacionamientos' => 2,
                'superficie' => '340 m²',
                'terreno_m2' => 360.00,
                'construccion_m2' => 340.00,
                'descripcion' => 'Espectacular residencia de diseño vanguardista en el corazón de Distrito Uno. Cuenta con acabados en mármol y encino, cocina gourmet totalmente equipada con isla de cuarzo, recámara principal con walk-in closet y tina de hidromasaje, terraza techada con asador y jardín privado. Seguridad 24/7 y acceso a casa club.',
                'imagen' => 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
                ],
                'telefono_asesor' => '526141234567',
                'destacada' => true,
                'clicks_sample' => 17,
            ],
            [
                'titulo' => 'Penthouse Exclusivo en Puerta de Hierro',
                'ubicacion' => 'Puerta de Hierro, Guadalajara, Jal.',
                'ciudad' => 'Guadalajara',
                'tipo' => 'Venta',
                'precio' => 12500000.00,
                'precio_texto' => '$12,500,000 MXN',
                'costo_base' => 11600000.00,
                'utilidad' => 900000.00,
                'estatus' => 'En Trato',
                'habitaciones' => 4,
                'recamaras' => 4,
                'banos' => 4.5,
                'estacionamientos' => 3,
                'superficie' => '420 m²',
                'terreno_m2' => 420.00,
                'construccion_m2' => 420.00,
                'descripcion' => 'Penthouse de doble altura en el piso 24 con vistas panorámicas hacia la zona financiera de Andares y la cañada. Distribución de lujo: elevador directo al departamento, family room, 4 recámaras con baño privado cada una, cava de vinos climatizada y amenidades de clase mundial como alberca infinity, spa y helipuerto.',
                'imagen' => 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
                ],
                'telefono_asesor' => '523398765432',
                'destacada' => true,
                'clicks_sample' => 31,
            ],
            [
                'titulo' => 'Departamento Ejecutivo en Providencia',
                'ubicacion' => 'Providencia, Guadalajara, Jal.',
                'ciudad' => 'Guadalajara',
                'tipo' => 'Renta',
                'precio' => 28500.00,
                'precio_texto' => '$28,500 MXN/mes',
                'costo_base' => 24000.00,
                'utilidad' => 4500.00,
                'estatus' => 'Activo',
                'habitaciones' => 2,
                'recamaras' => 2,
                'banos' => 2.0,
                'estacionamientos' => 2,
                'superficie' => '135 m²',
                'terreno_m2' => 135.00,
                'construccion_m2' => 135.00,
                'descripcion' => 'Departamento amueblado de alta gama sobre Avenida Providencia. Ideal para ejecutivos y profesionistas. Cuenta con ventanales de piso a techo, balcón privado arbolado, cocina italiana, aire acondicionado central inverter, gimnasio y business center en el edificio.',
                'imagen' => 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                ],
                'telefono_asesor' => '523311223344',
                'destacada' => true,
                'clicks_sample' => 22,
            ],
            [
                'titulo' => 'Villa de Lujo en Bosques de San Francisco',
                'ubicacion' => 'San Francisco, Chihuahua, Chih.',
                'ciudad' => 'Chihuahua',
                'tipo' => 'Venta',
                'precio' => 9400000.00,
                'precio_texto' => '$9,400,000 MXN',
                'costo_base' => 8650000.00,
                'utilidad' => 750000.00,
                'estatus' => 'Vendido',
                'habitaciones' => 4,
                'recamaras' => 4,
                'banos' => 5.0,
                'estacionamientos' => 4,
                'superficie' => '480 m²',
                'terreno_m2' => 550.00,
                'construccion_m2' => 480.00,
                'descripcion' => 'Majestuosa propiedad residencial construida frente al campo de golf. Dispone de alberca climatizada con jacuzzi, paneles solares de alta eficiencia, cochera techada para 4 camionetas, cuarto de servicio completo y sistema domótico integral para iluminación y audio.',
                'imagen' => 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
                ],
                'telefono_asesor' => '526145566778',
                'destacada' => true,
                'clicks_sample' => 40,
            ],
            [
                'titulo' => 'Casa Amueblada en Fraccionamiento La Cantera',
                'ubicacion' => 'La Cantera, Chihuahua, Chih.',
                'ciudad' => 'Chihuahua',
                'tipo' => 'Renta',
                'precio' => 24000.00,
                'precio_texto' => '$24,000 MXN/mes',
                'costo_base' => 20500.00,
                'utilidad' => 3500.00,
                'estatus' => 'Activo',
                'habitaciones' => 3,
                'recamaras' => 3,
                'banos' => 2.5,
                'estacionamientos' => 2,
                'superficie' => '220 m²',
                'terreno_m2' => 200.00,
                'construccion_m2' => 220.00,
                'descripcion' => 'Excelente casa en fraccionamiento privado con control de acceso y áreas verdes con juegos infantiles. Equipada con cisterna de 5,000 L, hidroneumático, dos unidades de clima artificial, closets de carpintería fina y portón eléctrico.',
                'imagen' => 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
                ],
                'telefono_asesor' => '526149988776',
                'destacada' => true,
                'clicks_sample' => 15,
            ],
            [
                'titulo' => 'Loft Vanguardista en Colonia Americana',
                'ubicacion' => 'Col. Americana, Guadalajara, Jal.',
                'ciudad' => 'Guadalajara',
                'tipo' => 'Renta',
                'precio' => 18500.00,
                'precio_texto' => '$18,500 MXN/mes',
                'costo_base' => 15500.00,
                'utilidad' => 3000.00,
                'estatus' => 'En Trato',
                'habitaciones' => 1,
                'recamaras' => 1,
                'banos' => 1.5,
                'estacionamientos' => 1,
                'superficie' => '95 m²',
                'terreno_m2' => 95.00,
                'construccion_m2' => 95.00,
                'descripcion' => 'Espacio tipo loft industrial con muros de ladrillo aparente y vigas de acero. Ubicado en el corazón cultural de la Colonia Americana, a pasos de cafeterías boutique, galerías de arte y restaurantes. Pet friendly y pet park en la azotea.',
                'imagen' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                'gallery' => [
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
                ],
                'telefono_asesor' => '523344556677',
                'destacada' => true,
                'clicks_sample' => 25,
            ],
        ];

        foreach ($propertiesData as $p) {
            $sampleClicks = $p['clicks_sample'];
            $gallery = $p['gallery'] ?? [];
            unset($p['clicks_sample']);
            unset($p['gallery']);

            $prop = Property::updateOrCreate(
                ['titulo' => $p['titulo']],
                $p
            );

            // Sembrar fotos en property_images
            $prop->images()->delete();
            foreach ($gallery as $imgUrl) {
                PropertyImage::create([
                    'property_id' => $prop->id,
                    'image_path' => $imgUrl,
                ]);
            }

            // Generar logs de clics de WhatsApp de prueba
            if ($prop->whatsappLogs()->count() === 0) {
                for ($i = 0; $i < $sampleClicks; $i++) {
                    WhatsAppLog::create([
                        'property_id' => $prop->id,
                        'ip_address' => '127.0.0.1',
                        'user_agent' => 'Renacer Client / Web Browser',
                        'created_at' => now()->subDays(rand(0, 14))->subHours(rand(0, 23)),
                    ]);
                }
            }
        }

        // Sembrar Favoritos
        $prop1 = Property::first();
        $prop3 = Property::find(3);
        if ($prop1) {
            Favorite::firstOrCreate(['user_id' => $cliente->id, 'property_id' => $prop1->id]);
        }
        if ($prop3) {
            Favorite::firstOrCreate(['user_id' => $cliente->id, 'property_id' => $prop3->id]);
        }

        // 3. Sembrar Leads de demostración en el CRM
        if (Lead::count() === 0) {
            Lead::create([
                'property_id' => 1,
                'user_id' => $vendedor->id, // Asignado a Carlos Mendoza
                'cliente_nombre' => 'Lic. Ricardo Saldaña',
                'cliente_telefono' => '526149871122',
                'origen' => 'WhatsApp',
                'estatus' => 'Nuevo',
                'notas' => 'Preguntó por formas de pago de contado y disponibilidad para visitar la residencia este fin de semana.',
                'created_at' => now()->subHours(2),
            ]);

            Lead::create([
                'property_id' => 2,
                'user_id' => $vendedor2->id, // Asignado a Mariana Ruiz
                'cliente_nombre' => 'Dra. Carmen Villarreal',
                'cliente_telefono' => '523319882233',
                'origen' => 'WhatsApp',
                'estatus' => 'Cita Agendada',
                'notas' => 'Cita agendada para el jueves a las 4:00 PM con su arquitecto en Puerta de Hierro.',
                'created_at' => now()->subDays(1),
            ]);

            Lead::create([
                'property_id' => 3,
                'user_id' => $vendedor2->id, // Asignado a Mariana Ruiz
                'cliente_nombre' => 'Ing. Fernando Montes',
                'cliente_telefono' => '523321554477',
                'origen' => 'WhatsApp',
                'estatus' => 'Contactado',
                'notas' => 'Se le envió la ficha técnica completa y reglamento del edificio en Providencia.',
                'created_at' => now()->subDays(2),
            ]);

            Lead::create([
                'property_id' => 5,
                'user_id' => $vendedor->id, // Asignado a Carlos Mendoza
                'cliente_nombre' => 'Arq. Valeria Gómez',
                'cliente_telefono' => '526144558899',
                'origen' => 'WhatsApp',
                'estatus' => 'Nuevo',
                'notas' => 'Interesada en arrendar por contrato empresarial de 2 años en La Cantera.',
                'created_at' => now()->subMinutes(45),
            ]);
        }
    }
}
