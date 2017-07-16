console.log("if (typeof global === 'undefined')\n  global = $.global;\n\n$.sfns = app.preferences.getPrefAsLong('Main Pref Section', 'Pref_SCRIPTING_FILE_NETWORK_SECURITY') === 1;\n\nif ($.sfns)\n  app.beginSuppressDialogs();\n\ntry {\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n$.result = (function defineBuildVideo(templatesDir) {\n  var _$ = $,\n      global = _$.global;\n\n  // Any Functions we place in the global namespace are going to be placed\n  // on an object called 'SoLive', which will act as a module.\n\n  var SoLive = global.SoLive = global.SoLive || {};\n\n  /******************************************************************************/\n  // Helper\n  /******************************************************************************/\n\n  var BREAK = {};\n\n  function clearRenderQueue() {\n    var renderQueue = app.project.renderQueue;\n\n    while (renderQueue.numItems > 0) {\n      renderQueue.item(1).remove();\n    }\n  }\n\n  function scaleComp(comp) {\n    var scale = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;\n\n\n    if (scale === 1) return comp;\n\n    var width = comp.width,\n        height = comp.height;\n\n\n    var resolutionFactor = Math.ceil(1 / scale);\n\n    var newWidth = width * scale * resolutionFactor;\n    var newHeight = height * scale * resolutionFactor;\n\n    var layerScale = newWidth / width * 100;\n\n    var newComp = app.project.items.addComp(comp.name + ' x ' + scale, newWidth, newHeight, comp.pixelAspect, comp.duration, comp.frameRate);\n\n    var layer = newComp.layers.add(comp);\n    layer.transform.scale.setValue([layerScale, layerScale]);\n    newComp.resolutionFactor = [resolutionFactor, resolutionFactor];\n\n    return newComp;\n  }\n\n  function renderComp(comp, options) {\n\n    var renders = new Folder(Folder.temp.absoluteURI + '/renders');\n    if (!renders.exists) renders.create();\n\n    var movie = new File(renders.absoluteURI + '/video-' + Date.now() + '.mov');\n\n    clearRenderQueue();\n\n    var renderQueue = app.project.renderQueue;\n\n\n    var item = renderQueue.items.add(comp);\n    item.applyTemplate('SoLive Settings');\n\n    var output = item.outputModule(1);\n    output.applyTemplate('SoLive Cineform');\n    output.file = movie;\n\n    renderQueue.render();\n\n    // TODO actually render the comp\n    return movie.absoluteURI;\n  }\n\n  function forEachComposition() {\n    var folder = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : app.project.rootFolder;\n    var func = arguments[1];\n    var numItems = folder.numItems;\n\n\n    for (var i = numItems; i > 0; i--) {\n\n      var comp = app.project.item(i);\n      if (comp instanceof CompItem) {\n        var result = func(comp);\n        if (result === BREAK) break;\n      }\n    }\n  }\n\n  function forEachLayer(comp, func) {\n    var numLayers = comp.numLayers;\n\n\n    for (var i = numLayers; i > 0; i--) {\n\n      var layer = comp.layer(i);\n      var result = func(layer);\n      if (result === BREAK) break;\n    }\n  }\n\n  function replaceText(textLayer, value) {\n\n    if (!value) {\n      textLayer.enabled = false;\n      return;\n    }\n\n    var textProperty = textLayer.property('Source Text');\n\n    var textDocument = textProperty.value;\n    textDocument.text = value;\n\n    textProperty.setValue(textDocument);\n  }\n\n  function replaceMedia(mediaLayer, value) {\n\n    mediaLayer.enabled = false;\n\n    // TODO\n    // Right now, media layers are disabled, they need to be added\n  }\n\n  function replaceLayer(layer, options, key) {\n\n    var value = options[key];\n    delete options[key];\n\n    if (layer instanceof TextLayer) replaceText(layer, value);else replaceMedia(layer, value);\n  }\n\n  function applyOptionsToLayersInComp(comp, options) {\n\n    forEachLayer(comp, function (layer) {\n      var source = layer.source,\n          name = layer.name;\n\n\n      if (source instanceof CompItem) return applyOptionsToLayersInComp(layer.source, options);\n\n      var keysLeft = 0;\n      for (var key in options) {\n        if (name === key) replaceLayer(layer, options, key);else keysLeft++;\n      }if (keysLeft === 0) return BREAK;\n    });\n  }\n\n  /******************************************************************************/\n  // Main\n  /******************************************************************************/\n\n  function getMainComp(template) {\n    var mainComp = void 0;\n\n    forEachComposition(app.project.rootFolder, function (comp) {\n      if (comp.name !== template) return;\n\n      mainComp = comp;\n      return BREAK;\n    });\n\n    return mainComp;\n  }\n\n  function validateOptions(options) {\n    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object' || options === null) throw new Error('Invalid options object.');\n  }\n\n  function instanceTemplate(template) {\n\n    closeProject();\n\n    var templatePath = templatesDir + '/' + template;\n    var aep = File(templatePath + '/' + template + '.aep');\n\n    // Instance Template\n    app.openFast(aep);\n    var instance = File(templatePath + '/' + template + '-instance.aep');\n    app.project.save(instance);\n\n    return instance;\n  }\n\n  function closeProject() {\n    if (app.project) app.project.close(CloseOptions.DO_NOT_SAVE_CHANGES);\n  }\n\n  function removeInstancedTemplate(instance) {\n\n    closeProject();\n\n    instance.remove();\n  }\n\n  /******************************************************************************/\n  // Expose to SoLive Module\n  /******************************************************************************/\n\n  SoLive.buildVideo = function (options) {\n\n    validateOptions(options);\n\n    var template = options.template,\n        scale = options.scale;\n\n    var instance = instanceTemplate(template);\n\n    var mainComp = getMainComp(template);\n    var exportComp = scaleComp(mainComp, scale);\n    if (!app.isRenderEngine) exportComp.openInViewer();\n\n    applyOptionsToLayersInComp(exportComp, options);\n\n    var url = renderComp(exportComp, options);\n\n    var width = exportComp.width,\n        height = exportComp.height,\n        rf = exportComp.resolutionFactor;\n\n\n    if (app.isRenderEngine) removeInstancedTemplate(instance);\n\n    return {\n      url: url,\n      width: width / rf[0],\n      height: height / rf[1]\n    };\n  };\n}).apply(this,[\"/Users/global/Programming/solive-video/dev-storage/templates\"]);\n\n} catch (err) {\n\n  if ($.sfns)\n    $.result = err;\n  else\n    throw new Error('Node.js cannot handle errors in After Effects unless \"Allow Scripts to Write Files and Access Network\" is enabled in \"General\" settings.');\n}\n\nif ($.sfns)\n  app.endSuppressDialogs(false);\n\nif ($.result !== undefined && !$.sfns)\n  throw new Error('Node.js cannot get a response from After Effects unless \"Allow Scripts to Write Files and Access Network\" is enabled in \"General\" settings.');\n\n$.cache = typeof console === 'object' && console._cache instanceof Array && console._cache || [];\n$.file = File('/var/folders/kw/pgpd5jh56f7b8flz1hhmr9n80000gn/T/ae-result-c79793d1-5e19-4fc3-88e8-6d47f49e2b64.json');\n$.file.open('w');\n$.file.write({\n  error: $.result instanceof Error ? $.result.message : null,\n  logs: $.cache.splice(0, $.cache.length),\n  result: $.result instanceof Error ? null : $.result\n}.toSource());\n$.file.close();\n\ndelete $.cache;\ndelete $.file;\ndelete $.result;\ndelete $.sfns;)")