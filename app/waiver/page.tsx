'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function WaiverPage() {
  const { t } = useLanguage();

  return (
    <main className="bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-[#0d2340] text-white py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#f5a623] text-sm font-bold uppercase tracking-wider mb-2">
            {t('Legal Agreement', 'Acuerdo Legal')}
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 leading-tight">
            {t(
              'Rental Agreement, Safety Rules, Assumption of Risk, Release of Liability, and Indemnification Agreement',
              'Acuerdo de Alquiler, Reglas de Seguridad, Asunción de Riesgo, Exención de Responsabilidad e Indemnización'
            )}
          </h1>
          <p className="text-white/60 text-sm mt-3">Sunny Slide Rentals LLC</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">

        {/* Required notice */}
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <p className="font-bold text-orange-800 text-sm mb-1">
            ⚠️ {t('Required Before Booking', 'Requerido Antes de Reservar')}
          </p>
          <p className="text-orange-700 text-sm leading-relaxed">
            {t(
              'You must agree to this waiver at checkout before completing your reservation. Please read all sections carefully.',
              'Debe aceptar esta exención al finalizar la compra antes de completar su reserva. Por favor lea todas las secciones cuidadosamente.'
            )}
          </p>
        </div>

        {/* Section 1 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-3">
            1. {t('Acknowledgement of Risk', 'Reconocimiento de Riesgo')}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'I understand that inflatable bounce houses, water slides, and related equipment involve inherent risks including falls, collisions, slips, impact injuries, drowning hazards associated with water activities, equipment misuse, and other injuries that may result in serious bodily injury, disability, or death. I voluntarily assume all risks associated with the use of the rented equipment by myself, my family members, guests, invitees, and participants attending the event.',
              'Entiendo que los castillos inflables, toboganes de agua y equipos relacionados conllevan riesgos inherentes que incluyen caídas, colisiones, resbalones, lesiones por impacto, peligros de ahogamiento relacionados con actividades acuáticas, mal uso del equipo y otras lesiones que pueden resultar en lesiones corporales graves, discapacidad o muerte. Asumo voluntariamente todos los riesgos asociados con el uso del equipo alquilado por mí mismo, mis familiares, invitados, personas invitadas y participantes que asistan al evento.'
            )}
          </p>
        </section>

        {/* Section 2 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-4">
            2. {t('Customer Safety Rules', 'Reglas de Seguridad del Cliente')}
          </h2>
          <ul className="space-y-2.5">
            {[
              {
                en: 'Adult supervision is required at all times while the inflatable is in use.',
                es: 'Se requiere supervisión adulta en todo momento mientras el inflable esté en uso.'
              },
              {
                en: 'Participants should be grouped by similar age and size whenever possible.',
                es: 'Los participantes deben agruparse por edad y tamaño similar siempre que sea posible.'
              },
              {
                en: 'Only one rider may slide down a water slide at a time.',
                es: 'Solo un participante puede deslizarse por el tobogán de agua a la vez.'
              },
              {
                en: 'Riders must wait until the landing area is completely clear before beginning their slide.',
                es: 'Los participantes deben esperar hasta que el área de aterrizaje esté completamente despejada antes de comenzar su deslizamiento.'
              },
              {
                en: 'No roughhousing, wrestling, tackling, pushing, flipping, horseplay, climbing, hanging from netting, or climbing on exterior walls.',
                es: 'No se permiten peleas, lucha, empujones, volteretas, juegos bruscos, trepar, colgarse de las mallas ni escalar las paredes exteriores.'
              },
              {
                en: 'No shoes, sandals, cleats, jewelry, eyeglasses, or sharp objects.',
                es: 'No se permiten zapatos, sandalias, tacos, joyas, anteojos ni objetos afilados.'
              },
              {
                en: 'No food, drinks, candy, gum, confetti, glitter, face paint, silly string, water balloons, or similar materials on or around the inflatable.',
                es: 'No se permiten alimentos, bebidas, dulces, chicle, confeti, purpurina, pintura facial, serpentina, globos de agua ni materiales similares sobre o alrededor del inflable.'
              },
              {
                en: 'No pets are permitted on or inside the inflatable.',
                es: 'No se permiten mascotas sobre ni dentro del inflable.'
              },
              {
                en: 'No smoking, vaping, alcohol, or illegal substances while using the inflatable.',
                es: 'No se permite fumar, vapear, consumir alcohol ni sustancias ilegales mientras se usa el inflable.'
              },
              {
                en: 'Manufacturer occupancy limits must be followed at all times.',
                es: 'Los límites de ocupación del fabricante deben respetarse en todo momento.'
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="text-[#f5a623] font-bold flex-shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{t(item.en, item.es)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-4">
            3. {t('Weather and Water Safety', 'Seguridad Climática y Acuática')}
          </h2>
          <ul className="space-y-2.5">
            {[
              {
                en: 'The inflatable shall not be used during lightning, thunderstorms, severe weather, or unsafe wind conditions.',
                es: 'El inflable no debe usarse durante rayos, tormentas eléctricas, clima severo o condiciones de viento inseguras.'
              },
              {
                en: 'At the first sound of thunder, sight of lightning, or issuance of a severe weather warning affecting the rental location, all participants must immediately exit the inflatable and remain out until conditions are safe.',
                es: 'Al primer sonido de trueno, vista de relámpago o emisión de una advertencia de clima severo que afecte el lugar de alquiler, todos los participantes deben salir inmediatamente del inflable y permanecer fuera hasta que las condiciones sean seguras.'
              },
              {
                en: 'The Customer is responsible for monitoring weather conditions throughout the rental period.',
                es: 'El Cliente es responsable de monitorear las condiciones climáticas durante todo el período de alquiler.'
              },
              {
                en: 'Water slide users must be supervised while entering, exiting, climbing, sliding, and while in any splash or landing area.',
                es: 'Los usuarios del tobogán de agua deben ser supervisados al entrar, salir, trepar, deslizarse y mientras estén en cualquier área de salpicadura o aterrizaje.'
              },
              {
                en: 'Children who cannot swim or are weak swimmers must be directly supervised by a responsible adult at all times while using water slide units.',
                es: 'Los niños que no saben nadar o son nadadores débiles deben ser supervisados directamente por un adulto responsable en todo momento mientras usan unidades de tobogán de agua.'
              },
              {
                en: 'Sunny Slide Rentals LLC reserves the right to suspend operation of any inflatable due to unsafe weather conditions.',
                es: 'Sunny Slide Rentals LLC se reserva el derecho de suspender la operación de cualquier inflable debido a condiciones climáticas inseguras.'
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                <span className="text-[#f5a623] font-bold flex-shrink-0 mt-0.5">•</span>
                <span className="leading-relaxed">{t(item.en, item.es)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-3">
            4. {t('Equipment Responsibilities', 'Responsabilidades del Equipo')}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'Sunny Slide Rentals LLC is solely responsible for setup and takedown. Customer shall not move, alter, disconnect, relocate, tamper with, or modify any equipment after installation. Customer may only operate the blower power switch if instructed. Continuous electrical service must be maintained while the inflatable is in use.',
              'Sunny Slide Rentals LLC es el único responsable de la instalación y desmontaje. El Cliente no debe mover, alterar, desconectar, reubicar, manipular ni modificar ningún equipo después de la instalación. El Cliente solo puede operar el interruptor de encendido del soplador si se le indica. El servicio eléctrico continuo debe mantenerse mientras el inflable esté en uso.'
            )}
          </p>
        </section>

        {/* Section 5 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-3">
            5. {t('Damage, Cleaning Fees, and Repairs', 'Daños, Tarifas de Limpieza y Reparaciones')}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'A minimum cleaning fee of $50 may be charged for silly string, water balloons, gum, food residue, or excessive dirt/debris. Additional repair or replacement charges may apply. Customer authorizes approved charges to the payment method on file.',
              'Se puede cobrar una tarifa mínima de limpieza de $50 por serpentina, globos de agua, chicle, residuos de alimentos o suciedad/escombros excesivos. Pueden aplicarse cargos adicionales de reparación o reemplazo. El Cliente autoriza los cargos aprobados al método de pago registrado.'
            )}
          </p>
        </section>

        {/* Section 6 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-3">
            6. {t('Release of Liability', 'Exención de Responsabilidad')}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'To the fullest extent permitted by Florida law, I release, waive, discharge, and hold harmless Sunny Slide Rentals LLC, its owners, employees, contractors, agents, and representatives from claims arising from use of the rented equipment, except where prohibited by law.',
              'En la mayor medida permitida por la ley de Florida, libero, renuncio, descargo y eximo de responsabilidad a Sunny Slide Rentals LLC, sus propietarios, empleados, contratistas, agentes y representantes de reclamaciones derivadas del uso del equipo alquilado, excepto donde esté prohibido por ley.'
            )}
          </p>
        </section>

        {/* Section 7 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-3">
            7. {t('Indemnification Agreement', 'Acuerdo de Indemnización')}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'Customer agrees to defend, indemnify, and hold harmless Sunny Slide Rentals LLC from claims, damages, attorney fees, costs, or expenses arising from failure to follow safety rules, negligent supervision, misuse of equipment, or actions of guests and participants.',
              'El Cliente acuerda defender, indemnizar y mantener indemne a Sunny Slide Rentals LLC de reclamaciones, daños, honorarios de abogados, costos o gastos que surjan del incumplimiento de las reglas de seguridad, supervisión negligente, mal uso del equipo o acciones de los invitados y participantes.'
            )}
          </p>
        </section>

        {/* Section 8 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-3">
            8. {t('Right to Terminate Use', 'Derecho a Terminar el Uso')}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'Sunny Slide Rentals LLC may immediately terminate use without refund if safety rules are violated, unsafe conditions exist, weather becomes hazardous, or equipment is misused.',
              'Sunny Slide Rentals LLC puede terminar inmediatamente el uso sin reembolso si se violan las reglas de seguridad, existen condiciones inseguras, el clima se vuelve peligroso o el equipo se usa indebidamente.'
            )}
          </p>
        </section>

        {/* Section 9 */}
        <section className="bg-white rounded-2xl shadow-sm p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-3">
            9. {t('Photo and Documentation Consent', 'Consentimiento de Fotografía y Documentación')}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {t(
              'Customer grants permission for photographs and documentation of the equipment and setup location for verification, insurance, safety, damage assessment, and marketing purposes.',
              'El Cliente otorga permiso para fotografías y documentación del equipo y el lugar de instalación para fines de verificación, seguro, seguridad, evaluación de daños y marketing.'
            )}
          </p>
        </section>

        {/* Section 10 */}
        <section className="bg-[#f5a623]/10 border border-[#f5a623]/40 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[#0d2340] mb-3">
            10. {t('Acknowledgement', 'Reconocimiento')}
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed font-medium">
            {t(
              'I certify that I am at least 18 years of age, am the authorized renter, have read and understand this agreement, understand the risks associated with inflatable equipment, agree to follow and enforce all safety rules, and voluntarily accept responsibility for supervision of all participants.',
              'Certifico que tengo al menos 18 años de edad, soy el arrendatario autorizado, he leído y entiendo este acuerdo, comprendo los riesgos asociados con el equipo inflable, acepto seguir y hacer cumplir todas las reglas de seguridad, y voluntariamente acepto la responsabilidad de supervisar a todos los participantes.'
            )}
          </p>
        </section>

        {/* CTA */}
        <div className="bg-[#1a6fa8] rounded-2xl p-6 text-center text-white">
          <p className="font-bold text-lg mb-2">
            {t('Ready to reserve?', '¿Listo para reservar?')}
          </p>
          <p className="text-white/80 text-sm mb-4">
            {t(
              'You will be asked to agree to this waiver at checkout.',
              'Se le pedirá que acepte esta exención al finalizar la compra.'
            )}
          </p>
          <Link
            href="/rentals"
            className="inline-block bg-[#f5a623] hover:bg-[#e09610] text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            {t('Browse Rentals →', 'Ver Alquileres →')}
          </Link>
        </div>

      </div>
    </main>
  );
}
