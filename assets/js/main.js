/* Portfolio Ari · JavaScript vanilla. Sin dependencias ni frameworks. */
(() => {
	'use strict';
	const root = document.documentElement;
	const toggle = document.querySelector('.theme-toggle');
	const icon = document.querySelector('.theme-symbol');
	const label = document.querySelector('.theme-label');
	const menuToggle = document.querySelector('.menu-toggle');
	const mobileMenu = document.getElementById('mobile-nav');
	const header = document.querySelector('.site-header');
	const dialog = document.getElementById('case-dialog');
	let lastFocus = null;
	let saved = null;

	try { saved = localStorage.getItem('ari-theme'); } catch (_) { /* almacenamiento deshabilitado */ }

	function setTheme(theme, persist = false) {
		const dark = theme === 'dark';
		root.dataset.theme = dark ? 'dark' : 'light';
		root.style.colorScheme = dark ? 'dark' : 'light';
		if (toggle) {
			toggle.setAttribute('aria-label', dark ? 'Activar modo claro' : 'Activar modo oscuro');
			toggle.setAttribute('aria-pressed', String(dark));
		}
		if (icon) icon.textContent = dark ? '☀' : '☾';
		if (label) label.textContent = dark ? 'Modo claro' : 'Modo oscuro';
		document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#090820' : '#F8F5FF');
		if (persist) { try { localStorage.setItem('ari-theme', theme); } catch (_) {} }
	}

	setTheme(saved === 'dark' || saved === 'light' ? saved : 'dark');
	toggle?.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));

	function menu(open, restore = false) {
		if (!mobileMenu || !menuToggle) return;
		mobileMenu.hidden = !open;
		menuToggle.setAttribute('aria-expanded', String(open));
		menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
		header?.classList.toggle('menu-open', open);
		if (open) { lastFocus = document.activeElement; mobileMenu.querySelector('a')?.focus(); }
		else if (restore) (lastFocus instanceof HTMLElement ? lastFocus : menuToggle).focus();
	}

	menuToggle?.addEventListener('click', () => menu(mobileMenu.hidden, mobileMenu.hidden === false));
	mobileMenu?.addEventListener('click', e => { if (e.target.closest('a')) menu(false); });
	document.addEventListener('click', e => { if (mobileMenu && !mobileMenu.hidden && !header?.contains(e.target)) menu(false); });
	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && mobileMenu && !mobileMenu.hidden) menu(false, true);
	});
	window.addEventListener('resize', () => { if (innerWidth >= 1060 && !mobileMenu.hidden) menu(false); });
	const markScroll = () => header?.classList.toggle('is-scrolled', scrollY > 8);
	markScroll();
	window.addEventListener('scroll', markScroll, { passive: true });

	const cases = {
		cubri: {
			title: 'Cubrí Seguros',
			subtitle: 'Prototipo de contratación digital para seguros de celulares y bicicletas.',
			sections: [
				['01 · Problema', 'Diseñar un recorrido claro para que una persona pueda conocer coberturas, cotizar y avanzar con la contratación de un seguro.'],
				['02 · Proceso', 'Se estructuró un flujo responsive con selección de equipo, formularios, comparación de planes y un resumen editable antes del pago.'],
				['03 · Solución', 'Prototipo de cotización con validaciones, persistencia del avance y simulación de pagos. No tiene backend ni procesa transacciones reales.'],
				['04 · Resultados y aprendizajes', 'El proyecto permitió trabajar el diseño de formularios, los estados del flujo y la consistencia entre pantallas. Los resultados de pruebas con usuarios deben documentarse por separado.']
			]
		},
		coffea: {
			title: 'Coffea Landing Page',
			subtitle: 'Diseño y desarrollo de una landing page para una cafetería.',
			sections: [
				['01 · Problema', 'Presentar una cafetería de manera atractiva y permitir que el visitante comprenda rápidamente su propuesta.'],
				['02 · Proceso', 'Se organizó el contenido en bloques visuales y se trabajó la jerarquía de títulos, fotografías y llamados a la acción.'],
				['03 · Solución', 'Landing page con identidad cálida, presentación de productos y adaptación a pantallas de diferentes tamaños.'],
				['04 · Resultados y aprendizajes', 'Práctica de composición, estilos visuales y responsive design. No se informaron resultados de pruebas de usuarios.']
			]
		},
		practicas: {
			title: 'Prácticas de página',
			subtitle: 'Landing page personal para servicios de diseño digital.',
			sections: [
				['01 · Problema', 'Crear una presencia web con personalidad que permita presentar servicios y facilitar el contacto.'],
				['02 · Proceso', 'Se definió una paleta oscura con acentos violeta y magenta, tarjetas de servicios y estructura de navegación por secciones.'],
				['03 · Solución', 'Página HTML y CSS con presentación, servicios, carrusel horizontal de testimonios, formulario de contacto y diseño responsive.'],
				['04 · Resultados y aprendizajes', 'Práctica de CSS Grid, Flexbox, degradados y adaptación responsive. El formulario es una demostración visual y no envía datos por sí solo.']
			]
		}
	};

	function openCase(id, trigger) {
		const data = cases[id];
		if (!data || !dialog || typeof dialog.showModal !== 'function') return;
		lastFocus = trigger;
		document.getElementById('case-title').textContent = data.title;
		document.getElementById('case-subtitle').textContent = data.subtitle;
		const slot = document.getElementById('case-sections');
		slot.replaceChildren();
		for (const [heading, body] of data.sections) {
			const section = document.createElement('section');
			const h = document.createElement('h3');
			const p = document.createElement('p');
			h.textContent = heading;
			p.textContent = body;
			section.append(h, p);
			slot.append(section);
		}
		dialog.showModal();
	}

	document.querySelectorAll('[data-case]').forEach(button => {
		button.addEventListener('click', () => openCase(button.dataset.case, button));
	});
	dialog?.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
	dialog?.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
	dialog?.addEventListener('close', () => lastFocus?.focus());
	const year = document.getElementById('year');
	if (year) year.textContent = String(new Date().getFullYear());
})();
