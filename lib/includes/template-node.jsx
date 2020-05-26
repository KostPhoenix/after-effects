if (typeof template_node != 'object') {
    $.global.template_node = (function(){
        return {
            process: function(config) {
                var project_file_path = root_path + "/templates/" + config['project_name'] + "/" + config['aep_name'] + ".aep";
                var project_file = new File(project_file_path);
                if (project_file.exists) {
                    app.open(project_file);
                    console.log('open');
                    for (var i = 0; i < config["compositions"].length; i++) {
                        var composition_config = config["compositions"][i];

                        var find = 0;
                        for (var j = 1; j <= app.project.numItems; j++) {
                            if ((app.project.item(j) instanceof CompItem) && (app.project.item(j).name === composition_config["name"])) {
                                var composition = app.project.item(j);

                                if(composition_config['cut_template']){
                                    var cut_template_config = composition_config['cut_template'];
                                    composition.duration = cut_template_config['time'];
                                }

                                for (var k = 0; k < composition_config["layers"].length; k++) {
                                    var layer_config = composition_config["layers"][k];
                                    var layer = composition.layer(layer_config["name"]);
                                    if (layer) {
                                        if (layer_config["value"] === "delete") {
                                            layer.remove();
                                        } else {
                                            // if (config["compositions"][i]["layers"][k]["position"]) {
                                            //     myArray = new Array();
                                            //     myArray[0] = config["compositions"][i]["layers"][k]["position"]['x'];
                                            //     myArray[1] = config["compositions"][i]["layers"][k]["position"]['y'];

                                            //     if (config["compositions"][i]["layers"][k]["position"]['value_at_key']) {
                                            //         myComp.layer(config["compositions"][i]["layers"][k]["name"]).position.setValueAtKey(config["compositions"][i]["layers"][k]["position"]['value_at_key'], myArray);
                                            //     } else {
                                            //         myComp.layer(config["compositions"][i]["layers"][k]["name"]).transform.position.setValue(myArray);
                                            //     }
                                            // }

                                            // if (config["compositions"][i]["layers"][k]["font_size"]) {
                                            //     myText = myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("Source Text").value;
                                            //     myText.fontSize = config["compositions"][i]["layers"][k]["font_size"]['px'];
                                            //     myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("Source Text").setValue(myText);
                                            // }


                                            if (layer_config["scale"]) {
                                                for (var l = 0; l < layer_config["scale"].length; l++) {
                                                    var scale_config = layer_config["scale"][l];

                                                    var scale_value = new Array();
                                                    scale_value[0] = scale_config['x'];
                                                    scale_value[1] = scale_config['y'];

                                                    if (scale_config['time']) {
                                                        layer.scale.setValueAtTime(scale_config['time'], scale_value);
                                                    } else if (scale_config['key']) {
                                                        layer.scale.setValueAtKey(scale_config['key'], scale_value);
                                                    } else {
                                                        layer.scale.setValue(scale_value);
                                                    }
                                                }
                                            }


                                            if (layer_config["rotation"]) {
                                                for (var l = 0; l < layer_config["rotation"].length; l++) {
                                                    var rotation_config = layer_config["rotation"][l];

                                                    if (rotation_config['time']) {
                                                        layer.rotation.setValueAtTime(rotation_config['time'], rotation_config['value']);
                                                    } else if (rotation_config['key']) {
                                                        layer.rotation.setValueAtKey(rotation_config['key'], rotation_config['value']);
                                                    } else {
                                                        layer.rotation.setValue(rotation_config['value']);
                                                    }
                                                }
                                            }

                                            if (layer_config["opacity"]) {
                                                for (var l = 0; l < layer_config["opacity"].length; l++) {
                                                    var opacity_config = layer_config["opacity"][l];

                                                    if (opacity_config['time']) {
                                                        layer.opacity.setValueAtTime(opacity_config['time'], opacity_config['value']);
                                                    } else if (opacity_config['key']) {
                                                        layer.opacity.setValueAtKey(opacity_config['key'], opacity_config['value']);
                                                    } else {
                                                        layer.opacity.setValue(opacity_config['value']);
                                                    }
                                                }
                                            }




                                            // if (config["compositions"][i]["layers"][k]["start_time"]) {
                                            //     if (config["compositions"][i]["layers"][k]["start_time"]['type'] == 'set') {
                                            //         myComp.layer(config["compositions"][i]["layers"][k]["name"]).startTime = config["compositions"][i]["layers"][k]["start_time"]['value'];
                                            //     }
                                            //     if (config["compositions"][i]["layers"][k]["start_time"]['type'] == 'plus') {
                                            //         myComp.layer(config["compositions"][i]["layers"][k]["name"]).startTime = myComp.layer(config["compositions"][i]["layers"][k]["name"]).startTime + config["compositions"][i]["layers"][k]["start_time"]['value'];
                                            //     }
                                            //     if (config["compositions"][i]["layers"][k]["start_time"]['type'] == 'minus') {
                                            //         myComp.layer(config["compositions"][i]["layers"][k]["name"]).startTime = myComp.layer(config["compositions"][i]["layers"][k]["name"]).startTime - config["compositions"][i]["layers"][k]["start_time"]['value'];
                                            //     }
                                            // }
                                            // if (config["compositions"][i]["layers"][k]["cut_template"]) {
                                            //     if (config["compositions"][i]["layers"][k]["cut_template"]["plus_second"]) {
                                            //         myComp.duration = myComp.layer(config["compositions"][i]["layers"][k]["name"]).startTime + config["compositions"][i]["layers"][k]["cut_template"]["plus_second"];
                                            //     }
                                            //     if (config["compositions"][i]["layers"][k]["cut_template"]["second"]) {
                                            //
                                            //     }
                                            // }


                                            // if (config["compositions"][i]["layers"][k]["shape"]) {
                                            //     if (config["compositions"][i]["layers"][k]["shape"]["scale"]) {
                                            //         myArray = new Array();
                                            //         myArray[0] = config["compositions"][i]["layers"][k]["shape"]["scale"]['x'];
                                            //         myArray[1] = config["compositions"][i]["layers"][k]["shape"]["scale"]['y'];
                                            //         myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("Contents").property(config["compositions"][i]["layers"][k]["shape"]['name']).transform.scale.setValue(myArray);
                                            //     }
                                            //     if (config["compositions"][i]["layers"][k]["shape"]["position"]) {
                                            //         myArray = new Array();
                                            //         myArray[0] = config["compositions"][i]["layers"][k]["shape"]["position"]['x'];
                                            //         myArray[1] = config["compositions"][i]["layers"][k]["shape"]["position"]['y'];
                                            //         myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("Contents").property(config["compositions"][i]["layers"][k]["shape"]['name']).transform.position.setValue(myArray);
                                            //     }

                                            //     if (config["compositions"][i]["layers"][k]["shape"]["size"]) {
                                            //         myArray = new Array();
                                            //         myArray[0] = config["compositions"][i]["layers"][k]["shape"]["size"]['x'];
                                            //         myArray[1] = config["compositions"][i]["layers"][k]["shape"]["size"]['y'];
                                            //         var layer = myComp.layer(config["compositions"][i]["layers"][k]["name"])
                                            //         var contents = layer.property("Contents")
                                            //         var shape = contents.property(config["compositions"][i]["layers"][k]["shape"]['name'])
                                            //         var contents = shape.property("Contents")
                                            //         var path = contents.property('Rectangle Path 1')
                                            //         var size = path.property('Size')
                                            //         size.setValue(myArray);
                                            //     }
                                            // }

                                            // if (config["compositions"][i]["layers"][k]["gradient"]) {
                                            //     myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("Эффекты").property(config["compositions"][i]["layers"][k]["gradient"]['name']).property('Начальный цвет').setValue(hexToColor(config["compositions"][i]["layers"][k]["gradient"]["start_hex"]));
                                            //     myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("Эффекты").property(config["compositions"][i]["layers"][k]["gradient"]['name']).property('Конечный цвет').setValue(hexToColor(config["compositions"][i]["layers"][k]["gradient"]["end_hex"]));
                                            // }

                                            // if (config["compositions"][i]["layers"][k]["color"]) {
                                            //     for (var q = 0; q < config["compositions"][i]["layers"][k]["color"].length; q++) {
                                            //         if (config["compositions"][i]["layers"][k]["color"][q]['name'] == 'text_color') {
                                            //             text = myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("ADBE Text Properties").property("ADBE Text Document").value;
                                            //             text.fillColor = hexToColor(config["compositions"][i]["layers"][k]["color"][q]["color_hex"]);
                                            //             myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("ADBE Text Properties").property("ADBE Text Document").setValue(text);
                                            //         } else {
                                            //             myComp.layer(config["compositions"][i]["layers"][k]["name"]).property("Contents").property(config["compositions"][i]["layers"][k]["color"][q]['name']).property("Contents").property('Fill 1').color.setValue(hexToColor(config["compositions"][i]["layers"][k]["color"][q]["color_hex"]));
                                            //         }
                                            //     }
                                            // }

                                            if (layer_config["value"]) {
                                                if (layer_config["value"] == 'system_empty') {
                                                    layer.property("Source Text").setValue('');
                                                } else if (layer_config["value_key"]) {
                                                    layer.property("Source Text").setValueAtKey(layer_config["value_key"], layer_config["value"])
                                                } else {
                                                    layer.property("Source Text").setValue(layer_config["value"]);
                                                }
                                            }
                                        }
                                    } else {
                                        throw new Error("Not found layer: " + layer_config["name"]);
                                    }

                                }
                                find = 1;
                            }
                        }
                        if (find === 0) {
                            throw new Error("Not found composition : " + composition_config["name"]);
                        }
                    }

                    var project_file = new File(root_path + "/Output/" + config["id"] + ".aepx");
                    console.log(root_path + "/Output/" + config["id"] + ".aepx");
                    app.project.save(project_file);
            },
        };
    })();
}

