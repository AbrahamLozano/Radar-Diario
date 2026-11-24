/* Radar Diario — lógica de la app. Los datos vienen de data.json (se actualiza cada noche). */
(function(){
  var data = JSON.parse(document.getElementById('radar-data').textContent);
  var topics = data.topics, order = ['gaming','dev','anim','ux','ia'];
  var SLUG = {gaming:'cultura-gamer', dev:'desarrollo-3d', anim:'animacion-vfx', ux:'diseno-ui-ux', ia:'ia'};
  var SHORT = {gaming:'Cultura gamer', dev:'Videojuegos y 3D', anim:'Animación y VFX', ux:'Diseño UI/UX', ia:'IA y herramientas'};
  var MES = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  var state = {ed: data.editions[0].id};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;


  var ICONS = {
    home:'<path d="M12 21.2a9.1 9.1 0 1 1 8.9-7.3"/><path d="M12 16.6a4.7 4.7 0 1 1 4.5-3.4"/><path d="M12.1 12 19.6 5.1"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="17.3" cy="17.6" r="1.1" fill="currentColor" stroke="none"/>',
    gaming:'<path d="M6.8 8.3h10.5c2.3 0 3.6 1.6 4 3.9l.8 4.4c.4 2.2-2.2 3.4-3.7 1.8l-2.3-2.5H7.9l-2.4 2.5c-1.5 1.6-4.1.4-3.7-1.8l.9-4.5c.4-2.2 1.8-3.8 4.1-3.8Z"/><path d="M7.4 10.9v3M5.9 12.4h3"/><circle cx="16.1" cy="11.5" r=".9" fill="currentColor" stroke="none"/><circle cx="17.9" cy="13.4" r=".9" fill="currentColor" stroke="none"/>',
    dev:'<path d="M12 2.9 20.2 7.4v9.3L12 21.2 3.8 16.6V7.3Z"/><path d="M3.9 7.4 12 11.9l8.2-4.5M12 12v9.1"/>',
    anim:'<path d="M2.8 20.4h18.6"/><circle cx="17.6" cy="15.9" r="2.6"/><circle cx="11.6" cy="7.4" r="2.4" opacity=".55"/><circle cx="5.9" cy="12.2" r="2.2" opacity=".3"/>',
    ux:'<path d="M4.6 3.4 18.9 9.6l-6 1.9-2.3 6.1Z"/><path d="M13.1 11.7l5.6 5.7"/><path d="M19.6 2.6v3.2M18 4.2h3.2"/>',
    ia:'<path d="M12 3.1c.5 3.9 2.6 6.1 6.6 6.8-4 .7-6.1 2.9-6.6 6.8-.5-3.9-2.6-6.1-6.6-6.8 4-.7 6.1-2.9 6.6-6.8Z"/><path d="M18.8 15.5c.2 1.6 1 2.4 2.5 2.7-1.5.3-2.3 1.1-2.5 2.7-.2-1.6-1-2.4-2.5-2.7 1.5-.3 2.3-1.1 2.5-2.7Z"/>',
    soccer:'<circle cx="12" cy="12" r="8.9"/><path d="M12 8.2l3.5 2.6-1.3 4.1H9.8l-1.3-4.1Z"/><path d="M12 8.2V3.4M15.5 10.8l4.4-1.6M14.2 14.9l2.8 3.9M9.8 14.9 7 18.8M8.5 10.8 4.1 9.2"/>',
    nfl:'<path d="M4.3 19.7c-1.4-4.6.2-9.7 4-13.4 3.8-3.7 8.8-5.1 11.4-4 1.4 4.6-.2 9.7-4 13.4-3.8 3.7-8.8 5.1-11.4 4Z"/><path d="M9.1 14.9l5.8-5.8M10.4 11.8l1.8 1.8M12.2 10l1.8 1.8"/>',
    fav:'<path d="M5.2 21.2V3.1"/><path d="M5.4 4 19.4 8.4 5.4 13.1"/>',
    cal:'<path d="M4.2 6.1h15.6v13.6H4.2Z"/><path d="M4.3 10h15.4M8.3 3.9v4M15.7 3.9v4"/><path d="M8 13.6h1.6M11.4 13.6H13M8 16.6h1.6"/>',
    note:'<path d="M5 4.2h10.6l3.4 3.4v12.2H5Z"/><path d="M8.2 10h7.6M8.2 13.2h7.6M8.2 16.4h4.6"/>',
    table:'<path d="M3.8 5h16.4v14H3.8Z"/><path d="M3.9 9.4h16.2M3.9 14.2h16.2M9 5.1v13.8"/>',
    clock:'<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.3 2.1"/>',
    speaker:'<path d="M4 9.2h3.6L12.4 5v14l-4.8-4.2H4Z"/><path d="M15.6 9.1c1.1 1.6 1.1 4.2 0 5.8M18.3 6.6c2.4 3 2.4 7.8 0 10.8"/>',
    play:'<path d="M7.4 4.9 19 12 7.4 19.1Z"/>',
    pause:'<path d="M8.4 5.2v13.6M15.6 5.2v13.6"/>',
    prev:'<path d="M6.2 5.2v13.6"/><path d="M18.4 5.4 9 12l9.4 6.6Z"/>',
    next:'<path d="M17.8 5.2v13.6"/><path d="M5.6 5.4 15 12l-9.4 6.6Z"/>',
    stop:'<path d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6"/>',
    whistle:'<circle cx="9" cy="14.5" r="5"/><path d="M12.6 11 20.6 7.6l.6 3.1-7.2 2.2"/><path d="M4.2 6.4l2 2M8.6 4.2v2.6"/>'
  };
  function icon(name, cls){
    var s = document.createElement('span');
    s.innerHTML = '<svg class="ico'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(ICONS[name]||'')+'</svg>';
    return s.firstChild;
  }
  (function(){
    var a = document.getElementById('sum-h'); if (a) a.insertBefore(icon('note'), a.firstChild);
    var b = document.getElementById('dates-h'); if (b) b.insertBefore(icon('cal'), b.firstChild);
  })();

  var DIAS = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  function sayDate(iso){ var p = iso.split('-'); var dt = new Date(+p[0], +p[1]-1, +p[2]); return DIAS[dt.getDay()]+' '+(+p[2])+' de '+MESES[+p[1]-1]; }
  function fmt(iso){ var p = iso.split('-'); return parseInt(p[2],10)+' '+MES[parseInt(p[1],10)-1]; }
  function el(tag, attrs, kids){
    var n = document.createElement(tag);
    for (var k in (attrs||{})) { if (k==='text') n.textContent = attrs[k]; else n.setAttribute(k, attrs[k]); }
    (kids||[]).forEach(function(c){ if (c) n.appendChild(c); });
    return n;
  }
  function color(t){ return 'var('+topics[t].color+')'; }
  function withTransition(fn){ if (document.startViewTransition && !reduce) document.startViewTransition(fn); else fn(); }
  function current(){
    var h = location.hash.replace('#','');
    for (var k in SLUG) if (SLUG[k]===h) return k;
    if (h.indexOf('deportes')===0 && data.sports && data.sports.leagues.length) return 'sports';
    return 'home';
  }
  function edition(){ return data.editions.filter(function(e){return e.id===state.ed;})[0]; }

  var sel = document.getElementById('ed');
  data.editions.forEach(function(e){ sel.appendChild(el('option',{value:e.id,text:e.label})); });
  sel.addEventListener('change', function(){ withTransition(function(){ state.ed = sel.value; render(); }); });

  var today = new Date(); today.setHours(0,0,0,0);
  function rel(iso, approx){
    var days = Math.round((new Date(iso+'T00:00:00') - today)/86400000);
    if (days < 0) return 'Ya pasó';
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Mañana';
    return (approx?'~':'')+'En '+days+' días';
  }
  var dl = document.getElementById('dates');
  data.keyDates.slice().sort(function(a,b){return a.date<b.date?-1:1;}).forEach(function(k){
    var past = new Date(k.date+'T00:00:00') < today;
    dl.appendChild(el('li',{class:past?'past':'','data-say':past?'':(rel(k.date,k.approx).replace('~','aproximadamente ')+': '+k.label)},[
      el('span',{class:'d'},[el('b',{text:rel(k.date,k.approx)}), document.createTextNode((k.approx?'~ ':'')+fmt(k.date))]),
      el('span',{text:k.label})
    ]));
  });

  function renderNav(ed, page){
    var ul = document.getElementById('pages'); ul.innerHTML='';
    var home = el('a',{href:'#inicio',style:'--c:var(--accent)'},[icon('home'), el('span',{text:'Inicio'})]);
    if (page==='home') home.setAttribute('aria-current','page');
    ul.appendChild(el('li',{},[home]));
    order.forEach(function(t){
      var n = ed.items.filter(function(i){return i.topic===t;}).length;
      var a = el('a',{href:'#'+SLUG[t],style:'--c:'+color(t)},[icon(t),el('span',{text:SHORT[t]}),el('span',{class:'n',text:String(n)})]);
      if (page===t) a.setAttribute('aria-current','page');
      ul.appendChild(el('li',{},[a]));
    });
    if (data.sports && data.sports.leagues.length){
      var sp = el('a',{href:'#deportes',style:'--c:var(--t-sport)'},[icon('soccer'),el('span',{text:'Deportes'})]);
      if (page==='sports') sp.setAttribute('aria-current','page');
      ul.appendChild(el('li',{},[sp]));
    }
  }

  function renderTopic(ed, t){
    var box = document.getElementById('view-topic'); box.innerHTML='';
    box.setAttribute('style','--c:'+color(t));
    var items = ed.items.filter(function(i){return i.topic===t;}).sort(function(a,b){return a.date<b.date?1:-1;});
    box.appendChild(el('header',{class:'topic-hero'},[icon(t,'lg'), el('h1',{text:topics[t].name,'data-say':topics[t].name+'. '+ed.label.replace('·',',')+'. '+items.length+(items.length===1?' nota.':' notas.')}), el('p',{text:items.length+(items.length===1?' nota':' notas')+' · '+ed.label})]));
    if (!items.length){ box.appendChild(el('p',{class:'empty',text:'No hay notas de este tema en esta edición.'})); return; }
    // Estilo periódico: nota principal, columna lateral y el resto en columnas con filetes.
    var score = function(i){ return (i.lead?100:0) + i.sources.length*2 + (i.date===items[0].date?1:0); };
    var ranked = items.slice().sort(function(a,b){ return score(b)-score(a) || (a.date<b.date?1:-1); });
    var lead = ranked[0], side = ranked.slice(1,3), rest = ranked.slice(3);
    function story(i, kind){
      var src = el('p',{class:'byline'},[document.createTextNode('Fuente: ')]);
      i.sources.forEach(function(s,k){ if (k) src.appendChild(document.createTextNode(', ')); src.appendChild(el('a',{href:s.url,target:'_blank',rel:'noopener',text:s.name})); });
      var Hn = kind==='lead' ? 'h2' : 'h3';
      return el('article',{class:'story '+kind,'data-say':(kind==='lead'?'Nota principal. ':'')+i.tag+'. '+i.title+'. '+i.summary},[
        el('p',{class:'kicker'},[el('span',{class:'tag'+(i.mx?' mx':''),text:i.tag}), el('time',{datetime:i.date,text:fmt(i.date)})]),
        el(Hn,{class:'hl',text:i.title}),
        el('p',{class:'dek',text:i.summary}),
        src
      ]);
    }
    var paper = el('div',{class:'paper'});
    paper.appendChild(el('div',{class:'p-lead'},[story(lead,'lead')]));
    if (side.length) paper.appendChild(el('div',{class:'p-side'}, side.map(function(i){ return story(i,'side'); })));
    if (rest.length) paper.appendChild(el('div',{class:'p-rest'}, rest.map(function(i){ return story(i,'col'); })));
    box.appendChild(paper);
  }


  /* ---------------- Deportes ---------------- */
  var sports = data.sports;
  var favs = (sports && sports.favorites) || [];
  var sportState = {conf:'AFC', round:{}};
  try { var sc = localStorage.getItem('radar-conf'); if (sc==='AFC'||sc==='NFC') sportState.conf = sc; } catch(e){}
  function leagueFromHash(){
    var h = location.hash.replace('#','');
    if (h.indexOf('deportes')!==0) return null;
    var id = h.split('-')[1];
    if (!id || id==='mis') return favs.length ? null : sports.leagues[0];
    return sports.leagues.filter(function(l){return l.id===id;})[0] || (favs.length ? null : sports.leagues[0]);
  }
  function shortDate(iso){ var p = iso.split('-'); var dt = new Date(+p[0], +p[1]-1, +p[2]); return ['dom','lun','mar','mié','jue','vie','sáb'][dt.getDay()]+' '+parseInt(p[2],10)+' '+MES[parseInt(p[1],10)-1]; }
  function cell(v, cls){ return el('td',{class:(cls||'')+(v===undefined||v===null?' na':'' ),text:(v===undefined||v===null)?'—':String(v)}); }

  function soccerTable(L){
    var hasG = L.standings.some(function(r){return r.gf!==undefined;});
    var cols = ['PJ','G','E','P'].concat(hasG?['GF','GC','DIF']:[]).concat(['Pts']);
    var thead = el('thead',{},[el('tr',{},[el('th',{class:'l',text:'#'}),el('th',{class:'l',text:'Equipo'})].concat(cols.map(function(c){return el('th',{text:c,title:{PJ:'Partidos jugados',G:'Ganados',E:'Empatados',P:'Perdidos',GF:'Goles a favor',GC:'Goles en contra',DIF:'Diferencia de goles',Pts:'Puntos'}[c]});})))]);
    var tb = el('tbody');
    L.standings.forEach(function(r){
      var z = (L.zones||[]).filter(function(z){return r.pos>=z.from && r.pos<=z.to;})[0];
      var dif = (r.gf!==undefined && r.gc!==undefined) ? (r.gf-r.gc>0?'+':'')+(r.gf-r.gc) : undefined;
      var tds = [el('td',{class:'pos',text:String(r.pos)}), el('td',{class:'l team',text:r.team}), cell(r.pj), cell(r.g), cell(r.e), cell(r.p)];
      if (hasG) tds = tds.concat([cell(r.gf), cell(r.gc), cell(dif)]);
      tds.push(cell(r.pts,'pts'));
      var fv = favFor(L.id, r.team);
      tb.appendChild(el('tr',{class:(z?'zone-'+z.kind:'')+(fv?' fav-row':''),style:fv?'--team:'+fv.color:''}, tds));
    });
    var panel = el('section',{class:'panel'},[el('h3',{},[el('span',{style:'display:flex;gap:8px;align-items:center;font-family:inherit;font-size:inherit;letter-spacing:0'},[icon('table'),document.createTextNode('Tabla general')]), el('span',{text:'Actualizada '+fmt(sports.updated)})]), el('div',{class:'tbl-wrap'},[el('table',{class:'std'},[thead,tb])])]);
    if (L.zones && L.zones.length){
      var lg = el('div',{class:'legend'});
      L.zones.forEach(function(z){ lg.appendChild(el('span',{style:'--z:var(--'+z.kind+')'},[el('i'), document.createTextNode(z.label+' ('+z.from+'–'+z.to+')')])); });
      panel.appendChild(lg);
    }
    var top3 = L.standings.slice(0,3).map(function(r){ return r.team+' con '+r.pts+' puntos'; });
    var favRows = L.standings.filter(function(r){ return favFor(L.id, r.team) && r.pos>3; }).map(function(r){ var f = favFor(L.id, r.team); return f.label+' va en el lugar '+r.pos+' con '+r.pts+' puntos'; });
    panel.setAttribute('data-say','Tabla general. Arriba: '+top3.join(', ')+'.'+(favRows.length?' '+favRows.join('. ')+'.':''));
    return panel;
  }

  function nflTable(L){
    var hasT = L.standings.some(function(r){return r.t>0;});
    var panel = el('section',{class:'panel'},[el('h3',{},[el('span',{style:'display:flex;gap:8px;align-items:center;font-family:inherit;font-size:inherit;letter-spacing:0'},[icon('table'),document.createTextNode('Tabla por división')]), el('span',{text:'Actualizada '+fmt(sports.updated)})])]);
    var tabs = el('div',{class:'conf-tabs',role:'group','aria-label':'Conferencia'});
    ['AFC','NFC'].forEach(function(c){
      var b = el('button',{type:'button','aria-pressed':String(sportState.conf===c),text:c});
      b.addEventListener('click', function(){ sportState.conf=c; try{localStorage.setItem('radar-conf',c);}catch(e){} withTransition(render); });
      tabs.appendChild(b);
    });
    panel.appendChild(tabs);
    var cols = ['G','P'].concat(hasT?['E']:[]).concat(['%','Siembra']);
    var thead = el('thead',{},[el('tr',{},[el('th',{class:'l',text:'Equipo'})].concat(cols.map(function(c){return el('th',{text:c,title:{G:'Ganados',P:'Perdidos',E:'Empates','%':'Porcentaje de victorias',Siembra:'Posición de playoffs en la conferencia'}[c]});})))]);
    var tb = el('tbody');
    var rows = L.standings.filter(function(r){return r.conf===sportState.conf;});
    var divs = []; rows.forEach(function(r){ if (divs.indexOf(r.div)<0) divs.push(r.div); });
    divs.sort().forEach(function(dv){
      tb.appendChild(el('tr',{class:'div-head'},[el('td',{colspan:String(cols.length+1),text:dv.replace(sportState.conf+' ','')})]));
      rows.filter(function(r){return r.div===dv;}).sort(function(a,b){return b.pct-a.pct || a.seed-b.seed;}).forEach(function(r){
        var tds = [el('td',{class:'l team',text:r.team}), cell(r.w), cell(r.l)];
        if (hasT) tds.push(cell(r.t));
        tds.push(cell(r.pct.toFixed(3).replace(/^0/,'')));
        tds.push(el('td',{},[el('span',{class:'seed'+(r.seed>7?' out':''),text:String(r.seed)})]));
        var fv = favFor(L.id, r.team);
        tb.appendChild(el('tr',{class:fv?'fav-row':'',style:fv?'--team:'+fv.color:''},tds));
      });
    });
    panel.appendChild(el('div',{class:'tbl-wrap'},[el('table',{class:'std'},[thead,tb])]));
    panel.appendChild(el('div',{class:'legend'},[el('span',{style:'--z:var(--good)'},[el('i'),document.createTextNode('Siembras 1–7: en zona de playoffs')])]));
    var leaders = divs.sort().map(function(dv){ var top = L.standings.filter(function(r){return r.div===dv;}).sort(function(a,b){return b.pct-a.pct || a.seed-b.seed;})[0]; return dv.replace(sportState.conf+' ','')+', '+top.team+' con '+top.w+' y '+top.l; });
    panel.setAttribute('data-say','Tabla de la '+sportState.conf+'. Líderes de división: '+leaders.join('; ')+'.');
    return panel;
  }

  function gameRow(g, isNfl, upcoming){
    var homeWin = !upcoming && g.hs>g.as, awayWin = !upcoming && g.as>g.hs;
    var left = isNfl ? g.away : g.home, right = isNfl ? g.home : g.away;
    var ls = isNfl ? g.as : g.hs, rs = isNfl ? g.hs : g.as;
    var lw = isNfl ? awayWin : homeWin, rw = isNfl ? homeWin : awayWin;
    var score = upcoming ? el('span',{class:'sc time',text:(g.time||'')+(g.time?' h':'')}) : el('span',{class:'sc',text:ls+' – '+rs});
    var dateBox = el('span',{class:'d'},[document.createTextNode(shortDate(g.date))]);
    var rightBox = el('span',{class:(rw?'w':(upcoming?'':(lw?'lose':'')))},[document.createTextNode((isNfl?'@ ':'')+right)]);
    if (g.note) rightBox.appendChild(el('span',{class:'tag-n',text:g.note}));
    var say = upcoming
      ? (left+(isNfl?' visita a ':' contra ')+right+', '+sayDate(g.date)+(g.time?' a las '+g.time:'')+'.')
      : (left+' '+ls+', '+right+' '+rs+'.');
    return el('li',{'data-say':say},[dateBox, el('span',{class:'h '+(lw?'w':(upcoming?'':(rw?'lose':'')))},[document.createTextNode(left)]), score, rightBox]);
  }

  function resultsPanel(L){
    var isNfl = L.sport==='nfl';
    var idx = sportState.round[L.id]||0;
    var round = L.rounds[idx];
    var p = el('section',{class:'panel'},[el('h3',{'data-say':'Resultados, '+round.label+'.'},[el('span',{style:'display:flex;gap:8px;align-items:center;font-family:inherit;font-size:inherit;letter-spacing:0'},[icon('whistle'),document.createTextNode('Resultados')]), el('span',{text:round.label+' · '+round.dates})])]);
    if (L.rounds.length>1){
      var rs = el('div',{class:'round-sel',role:'group','aria-label':'Elegir jornada'});
      L.rounds.forEach(function(r,i){
        var b = el('button',{type:'button','aria-pressed':String(i===idx),text:r.label});
        b.addEventListener('click', function(){ sportState.round[L.id]=i; withTransition(render); });
        rs.appendChild(b);
      });
      p.appendChild(rs);
    }
    var ul = el('ul',{class:'games'});
    round.games.forEach(function(g){ var li = gameRow(g,isNfl,false); var fv = favFor(L.id,g.home)||favFor(L.id,g.away); if (fv){ li.classList.add('fav-game'); li.style.setProperty('--team',fv.color); } ul.appendChild(li); });
    p.appendChild(ul);
    return p;
  }
  function nextPanel(L){
    var isNfl = L.sport==='nfl';
    var p = el('section',{class:'panel'},[el('h3',{'data-say':'Próximos partidos, '+L.next.label+'.'},[el('span',{style:'display:flex;gap:8px;align-items:center;font-family:inherit;font-size:inherit;letter-spacing:0'},[icon('clock'),document.createTextNode('Próximos partidos')]), el('span',{text:L.next.label+' · '+L.next.dates})])]);
    var ul = el('ul',{class:'games'});
    L.next.games.forEach(function(g){ var li = gameRow(g,isNfl,true); var fv = favFor(L.id,g.home)||favFor(L.id,g.away); if (fv){ li.classList.add('fav-game'); li.style.setProperty('--team',fv.color); } ul.appendChild(li); });
    p.appendChild(ul);
    p.appendChild(el('p',{class:'sport-note',style:'margin:8px 0 0',text:'Horarios del centro de México.'+(isNfl?' Formato: visitante @ local.':' Formato: local – visitante.')}));
    return p;
  }


  function favFor(leagueId, team){ return favs.filter(function(f){ return f.leagues.indexOf(leagueId)>=0 && f.team===team; })[0]; }
  function leagueById(id){ return sports.leagues.filter(function(l){return l.id===id;})[0]; }
  function ordinal(n){ return n+'.º'; }

  function favCard(f){
    var L = leagueById(f.leagues[0]); if (!L) return null;
    var isNfl = L.sport==='nfl';
    var row = L.standings.filter(function(r){return r.team===f.team;})[0];
    var card = el('article',{class:'fav',style:'--team:'+f.color},[
      el('div',{class:'who'},[el('h2',{text:f.label}), el('span',{text:f.official+' · '+L.name})])
    ]);
    if (row){
      var big, sub, stats;
      if (isNfl){
        var divRows = L.standings.filter(function(r){return r.div===row.div;}).sort(function(a,b){return b.pct-a.pct || a.seed-b.seed;});
        var dpos = divRows.indexOf(row)+1;
        big = row.w+'–'+row.l+(row.t?'–'+row.t:'');
        sub = el('small',{},[document.createTextNode(ordinal(dpos)+' en la '+row.div), el('em',{text:'Siembra '+row.seed+' de la '+row.conf+(row.seed<=7?' · en zona de playoffs':' · fuera de playoffs por ahora')})]);
        stats = [['G',row.w],['P',row.l],['E',row.t],['%',row.pct.toFixed(3).replace(/^0/,'')]];
      } else {
        var z = (L.zones||[]).filter(function(z){return row.pos>=z.from && row.pos<=z.to;})[0];
        big = ordinal(row.pos);
        sub = el('small',{},[document.createTextNode(row.pts+' puntos en '+(row.pj||'—')+' partidos'), el('em',{text:z ? 'En zona: '+z.label : 'Fuera de las zonas de clasificación'})]);
        stats = [['PJ',row.pj],['G',row.g],['E',row.e],['P',row.p]];
        if (row.gf!==undefined) stats.push(['DIF',(row.gf-row.gc>0?'+':'')+(row.gf-row.gc)]);
      }
      var bigEl = isNfl ? el('b',{text:big}) : el('b',{},[document.createTextNode(String(row.pos)), el('span',{class:'ord',text:'º'})]);
      card.appendChild(el('div',{class:'big'},[bigEl, sub]));
      card.appendChild(el('div',{class:'statline'}, stats.map(function(s){ return el('div',{},[el('b',{text:(s[1]===undefined||s[1]===null)?'—':String(s[1])}), el('span',{text:s[0]})]); })));
    }
    // últimos resultados (todas sus competencias)
    var played = [];
    f.leagues.forEach(function(id){
      var LL = leagueById(id); if (!LL) return;
      LL.rounds.forEach(function(r){ r.games.forEach(function(g){ if (g.home===f.team || g.away===f.team) played.push({g:g, L:LL, round:r.label}); }); });
    });
    played.sort(function(a,b){ return a.g.date<b.g.date?1:-1; });
    if (played.length){
      var ul = el('ul',{class:'games'});
      played.slice(0,5).forEach(function(x){
        var mine = x.g.home===f.team ? x.g.hs : x.g.as, theirs = x.g.home===f.team ? x.g.as : x.g.hs;
        var res = mine>theirs?'W':(mine<theirs?'L':'D');
        var li = gameRow(x.g, x.L.sport==='nfl', false);
        li.firstChild.appendChild(el('br')); li.firstChild.appendChild(el('span',{class:'res-badge '+res,text:{W:'G',D:'E',L:'P'}[res],title:{W:'Ganó',D:'Empató',L:'Perdió'}[res]}));
        if (f.leagues.length>1) li.lastChild.appendChild(el('span',{class:'tag-n',text:x.L.name}));
        ul.appendChild(li);
      });
      card.appendChild(el('div',{},[el('h3',{text:'Últimos resultados'}), ul]));
    }
    // próximo
    var upcoming = [];
    f.leagues.forEach(function(id){
      var LL = leagueById(id); if (!LL || !LL.next) return;
      LL.next.games.forEach(function(g){ if (g.home===f.team || g.away===f.team) upcoming.push({g:g, L:LL}); });
    });
    upcoming.sort(function(a,b){ return a.g.date<b.g.date?-1:1; });
    if (upcoming.length){
      var ul2 = el('ul',{class:'games'});
      upcoming.forEach(function(x){ var li = gameRow(x.g, x.L.sport==='nfl', true); li.lastChild.appendChild(el('span',{class:'tag-n',text:x.L.name})); ul2.appendChild(li); });
      card.appendChild(el('div',{},[el('h3',{text:'Próximo partido'}), ul2]));
    }
    // otras competencias
    f.leagues.slice(1).forEach(function(id){
      var LL = leagueById(id); if (!LL) return;
      var r = LL.standings.filter(function(x){return x.team===f.team;})[0];
      if (!r) return;
      var z = (LL.zones||[]).filter(function(z){return r.pos>=z.from && r.pos<=z.to;})[0];
      card.appendChild(el('p',{class:'also'},[el('b',{text:LL.name+': '}), document.createTextNode(ordinal(r.pos)+' con '+r.pts+' puntos ('+r.g+'G '+r.e+'E '+r.p+'P)'+(z?' · '+z.label:''))]));
    });
    if (f.note) card.appendChild(el('p',{class:'also',text:f.note}));
    card.appendChild(el('p',{class:'more'},[el('a',{href:'#deportes-'+L.id,text:'Ver tabla completa de '+L.name+' →'})]));
    var sayParts = [f.label+'.'];
    if (row) sayParts.push(isNfl ? ('Récord de '+row.w+' ganados y '+row.l+' perdidos, siembra '+row.seed+' de la '+row.conf+'.') : ('Lugar '+row.pos+' de '+L.name+' con '+row.pts+' puntos.'));
    if (f.note) sayParts.push(f.note);
    if (upcoming.length){ var ng = upcoming[0].g; sayParts.push('Próximo partido: '+ng.home+' contra '+ng.away+', '+sayDate(ng.date)+(ng.time?' a las '+ng.time:'')+'.'); }
    card.setAttribute('data-say', sayParts.join(' '));
    return card;
  }
  function renderFavs(box){
    box.appendChild(el('div',{class:'league-head'},[el('h2',{text:'Mis equipos'}), el('span',{class:'phase',text:favs.map(function(f){return f.label;}).join(' · ')})]));
    var grid = el('div',{class:'fav-grid'});
    favs.forEach(function(f){ var c = favCard(f); if (c) grid.appendChild(c); });
    box.appendChild(grid);
  }

  function renderSports(){
    var box = document.getElementById('view-sports'); box.innerHTML='';
    var L = leagueFromHash();
    box.appendChild(el('header',{class:'topic-hero',style:'--c:var(--t-sport)'},[icon('soccer','lg'), el('h1',{text:'Deportes'}), el('p',{text:'Tablas y resultados · actualizado '+fmt(sports.updated)})]));
    var bar = el('nav',{class:'league-bar','aria-label':'Ligas'});
    if (favs.length){
      var fa = el('a',{href:'#deportes-mis-equipos'},[icon('fav'), document.createTextNode('Mis equipos')]);
      if (!L) fa.setAttribute('aria-current','page');
      bar.appendChild(el('div',{class:'league-group'},[el('h2',{},[icon('fav'), document.createTextNode('Favoritos')]), el('ul',{},[el('li',{},[fa])])]));
    }
    [['soccer','Futbol soccer'],['nfl','Futbol americano']].forEach(function(gp){
      var ls = sports.leagues.filter(function(l){return l.sport===gp[0];});
      if (!ls.length) return;
      var ul = el('ul');
      ls.forEach(function(l){
        var a = el('a',{href:'#deportes-'+l.id,text:l.name});
        if (L && l.id===L.id) a.setAttribute('aria-current','page');
        ul.appendChild(el('li',{},[a]));
      });
      bar.appendChild(el('div',{class:'league-group'},[el('h2',{},[icon(gp[0]), document.createTextNode(gp[1])]), ul]));
    });
    box.appendChild(bar);
    if (!L){ renderFavs(box); return; }
    box.appendChild(el('div',{class:'league-head'},[el('h2',{text:L.name,'data-say':L.name+'. '+L.phase+'.'}), el('span',{class:'phase',text:L.phase}), el('span',{class:'meta',text:L.season})]));
    var left = el('div',{},[L.sport==='nfl' ? nflTable(L) : soccerTable(L)]);
    var right = el('div',{},[resultsPanel(L), nextPanel(L)]);
    box.appendChild(el('div',{class:'sport-grid'},[left,right]));
    var note = el('div',{class:'sport-note'});
    if (L.extra) note.appendChild(el('p',{text:L.extra}));
    if (L.note) note.appendChild(el('p',{text:L.note}));
    var src = el('p',{},[document.createTextNode('Fuentes: ')]);
    L.sources.forEach(function(s,i){
      if (i) src.appendChild(document.createTextNode(' · '));
      src.appendChild(s.url ? el('a',{href:s.url,target:'_blank',rel:'noopener',text:s.name}) : document.createTextNode(s.name));
    });
    note.appendChild(src);
    note.appendChild(el('p',{text:sports.intro}));
    box.appendChild(note);
  }

  function render(){
    var ed = edition(), page = current();
    document.getElementById('meta-ed').textContent = ed.label;
    document.getElementById('sum-text').textContent = ed.summary;
    document.getElementById('sum-meta').textContent = ed.items.length+' notas hoy. Usa los botones de arriba para ver cada tema.';
    renderNav(ed, page);
    document.getElementById('view-home').hidden = page!=='home';
    document.getElementById('view-topic').hidden = (page==='home' || page==='sports');
    document.getElementById('view-sports').hidden = page!=='sports';
    if (page==='sports') renderSports(); else if (page!=='home') renderTopic(ed, page);
    document.title = (page==='home' ? '' : (page==='sports' ? 'Deportes' : topics[page].name)+' · ') + 'Radar Diario de Abraham';
  }
  /* ---------------- Lectura en voz alta (solo la página que estás viendo) ---------------- */
  var synth = window.speechSynthesis;
  var reader = {queue:[], i:0, on:false, paused:false, rate:1, token:0, voice:null};
  var RATES = [1, 1.2, 1.4, 0.85];
  function pickVoice(){
    if (!synth) return null;
    var vs = synth.getVoices();
    var pref = ['es-MX','es-US','es-419','es_MX','es_US'];
    for (var k=0;k<pref.length;k++){ var v = vs.filter(function(x){return x.lang===pref[k];})[0]; if (v) return v; }
    return vs.filter(function(x){return /^es/i.test(x.lang);})[0] || null;
  }
  if (synth && 'onvoiceschanged' in synth) synth.onvoiceschanged = function(){ reader.voice = pickVoice(); };
  function clean(s){
    return String(s||'').replace(/\s+/g,' ').replace(/ – /g,' a ').replace(/–/g,' a ').replace(/ @ /g,' en casa de ')
      .replace(/(\d{1,2}:\d{2}) h\b/g,'$1 horas').replace(/\bvs\b/g,'contra').replace(/\bJ(\d+)\b/g,'jornada $1').trim();
  }
  function currentView(){ return ['view-home','view-topic','view-sports'].map(function(id){return document.getElementById(id);}).filter(function(e){return e && !e.hidden;})[0]; }
  function pageName(){ var p = current(); return p==='home' ? 'la portada' : (p==='sports' ? 'Deportes' : topics[p].name); }
  function collect(){
    var v = currentView(); if (!v) return [];
    var q = [];
    if (current()==='home'){
      q.push({el:document.querySelector('header.masthead'), text:'Radar diario. '+edition().label.replace('·',',')+'.'});
      q.push({el:document.getElementById('sum-text'), text:'Lo más importante del día. '+document.getElementById('sum-text').textContent});
      q.push({el:document.getElementById('dates-h'), text:'Fechas clave.'});
    }
    [].slice.call(v.querySelectorAll('[data-say]')).forEach(function(n){ var s = n.getAttribute('data-say'); if (s) q.push({el:n, text:s}); });
    return q.map(function(x){ return {el:x.el, text:clean(x.text)}; });
  }
  function chunks(text){
    var parts = text.match(/[^.!?;]+[.!?;]*/g) || [text], out = [], buf = '';
    parts.forEach(function(p){ if ((buf+p).length > 220 && buf){ out.push(buf.trim()); buf = p; } else buf += p; });
    if (buf.trim()) out.push(buf.trim());
    return out;
  }
  function mark(i){
    [].slice.call(document.querySelectorAll('.reading')).forEach(function(n){ n.classList.remove('reading'); });
    var it = reader.queue[i]; if (!it || !it.el) return;
    it.el.classList.add('reading');
    try { it.el.scrollIntoView({block:'center', behavior: reduce?'auto':'smooth'}); } catch(e){}
  }
  function speakItem(i){
    if (!reader.on) return;
    if (i >= reader.queue.length){ stopReading(true); return; }
    reader.i = i; reader.paused = false; mark(i); updateBar();
    var my = ++reader.token, parts = chunks(reader.queue[i].text), k = 0;
    synth.cancel();
    (function next(){
      if (my !== reader.token || !reader.on) return;
      if (k >= parts.length){ speakItem(i+1); return; }
      var u = new SpeechSynthesisUtterance(parts[k++]);
      u.lang = 'es-MX'; if (reader.voice) u.voice = reader.voice; u.rate = reader.rate;
      u.onend = function(){ next(); };
      u.onerror = function(e){ if (e.error!=='interrupted' && e.error!=='canceled') next(); };
      synth.speak(u);
    })();
  }
  function startReading(){
    if (!synth){ return; }
    reader.voice = reader.voice || pickVoice();
    reader.queue = collect(); reader.on = true; reader.page = pageName();
    showBar(true); speakItem(0);
  }
  function stopReading(finished){
    reader.on = false; reader.paused = false; reader.token++;
    if (synth) synth.cancel();
    [].slice.call(document.querySelectorAll('.reading')).forEach(function(n){ n.classList.remove('reading'); });
    showBar(false);
    var b = document.getElementById('listen'); if (b) b.setAttribute('aria-pressed','false');
  }
  function togglePause(){
    if (!reader.on) return;
    if (reader.paused){ synth.resume(); reader.paused = false; }
    else { synth.pause(); reader.paused = true; }
    updateBar();
  }
  var bar = el('div',{class:'reader-bar',role:'region','aria-label':'Lectura en voz alta',hidden:''});
  var barStatus = el('div',{class:'rb-status','aria-live':'polite'});
  function rbBtn(ic, label, fn){ var b = el('button',{type:'button',class:'rb-btn','aria-label':label,title:label},[icon(ic)]); b.addEventListener('click', fn); return b; }
  var bPrev = rbBtn('prev','Nota anterior', function(){ if (reader.on) speakItem(Math.max(0, reader.i-1)); });
  var bPlay = rbBtn('pause','Pausar', togglePause);
  var bNext = rbBtn('next','Siguiente nota', function(){ if (reader.on) speakItem(reader.i+1); });
  var bRate = el('button',{type:'button',class:'rb-btn rb-rate','aria-label':'Velocidad de lectura',title:'Velocidad'},[document.createTextNode('1×')]);
  bRate.addEventListener('click', function(){ var k = RATES.indexOf(reader.rate); reader.rate = RATES[(k+1)%RATES.length]; bRate.textContent = String(reader.rate).replace('.',',')+'×'; if (reader.on) speakItem(reader.i); });
  var bStop = rbBtn('stop','Dejar de leer', function(){ stopReading(); });
  bar.appendChild(el('span',{class:'rb-ico'},[icon('speaker')]));
  bar.appendChild(barStatus);
  [bPrev,bPlay,bNext,bRate,bStop].forEach(function(b){ bar.appendChild(b); });
  document.body.appendChild(bar);
  function showBar(on){ if (on) bar.removeAttribute('hidden'); else bar.setAttribute('hidden',''); }
  function updateBar(){
    barStatus.innerHTML = '';
    barStatus.appendChild(el('b',{text:(reader.paused?'En pausa · ':'Leyendo ')+reader.page}));
    barStatus.appendChild(el('span',{text:(reader.i+1)+' de '+reader.queue.length}));
    bPlay.innerHTML = ''; bPlay.appendChild(icon(reader.paused?'play':'pause'));
    bPlay.setAttribute('aria-label', reader.paused?'Continuar':'Pausar'); bPlay.title = bPlay.getAttribute('aria-label');
  }
  (function(){
    var b = document.getElementById('listen'); if (!b) return;
    if (!synth){ b.disabled = true; b.title = 'Este navegador no puede leer en voz alta'; return; }
    b.addEventListener('click', function(){
      if (reader.on){ stopReading(); return; }
      b.setAttribute('aria-pressed','true'); startReading();
    });
  })();
  window.addEventListener('beforeunload', function(){ if (synth) synth.cancel(); });

  window.addEventListener('hashchange', function(){ if (reader.on) stopReading(); withTransition(render); window.scrollTo(0,0); });
  sel.addEventListener('change', function(){ if (reader.on) stopReading(); });
  render();
})();

/* Celular: mantener visible el tema activo en la barra deslizable */
(function(){
  function center(){ var a = document.querySelector('nav.pages a[aria-current="page"]'); if (a && a.scrollIntoView) try { a.scrollIntoView({inline:'center', block:'nearest'}); } catch(e){} }
  window.addEventListener('hashchange', function(){ setTimeout(center, 60); });
  setTimeout(center, 60);
})();
