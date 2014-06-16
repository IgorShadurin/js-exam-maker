function replaceAll(str, find, replace) {
    //return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);

    return str.split(find).join(replace);
}

var data = [
    {"id": 123, "description": "<p>Text with p tag</p>", "points": "234", "myCheck": true},
    {"id": 124, "description": "<p>23t32t34Text with p tag</p>", "points": "789", "myCheck": true}
];

if (localStorage.getItem('json')) {
    data = localStorage.getItem('json');
}

function randomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 30; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


function getHelperByType(type) {
    var content = "Nothing((";
    if (type == 'stringArray') {
        content = "<p>Ответ</p>" +
            "<input class='text-input' type='string' placeholder='Список вариантов через символ #'><br>" +
            "<button class='add-string-array btn btn-primary'>Добавить</button>" +
            "<div class='variants-draw'></div>";
    }

    if (type == 'string') {
        content = "<p>Ответ</p>" +
            "<input class='text-input' type='string' placeholder='Введите ответ'><br>" +
            "<button class='add-string btn btn-primary'>Добавить</button>" +
            "<div class='variants-draw'></div>";
    }

    if (type == 'single') {
        content = "<p>Ответ</p>" +
            "<input class='text-input' type='string' placeholder='Список вариантов через символ #'><br>" +
            "<button class='add-single btn btn-primary'>Добавить</button>" +
            "<div class='variants-draw'></div>";
    }

    if (type == 'multi') {
        content = "<p>Ответ</p>" +
            "<input class='text-input' type='string' placeholder='Список вариантов через символ #'><br>" +
            "<button class='add-multi btn btn-primary'>Добавить</button>" +
            "<div class='variants-draw'></div>";
    }

    return "<br>" + content;
}

function registerHelpers() {
    // todo bind event listeners
}

function drawHelper(selector) {
    var selected = selector.find(":selected").val();
    console.log(selected);
    var content = getHelperByType(selected);
    $('<div class="variant-maker">' + content + '</div>').insertAfter(selector);
    if (selected == "multi") {
        fillMulti(selector, true);
    }

    if (selected == "single") {
        fillSingle(selector, true);
    }

    if (selected == "string") {
        fillString(selector, true);
    }

    if (selected == "stringArray") {
        fillStringArray(selector, true);
    }
}

function onElementsUpdate() {
    console.log('updated');
    $.each($('select'), function (k, v) {
        if (!$(v).parent().find('.variant-maker').length) {
            drawHelper($(v));
        }

        $(v).unbind('click');
        $(v).change(function (e) {
            var selected = $(this).find(":selected").val();
            var content = getHelperByType(selected);
            $(this).parent().find('.variant-maker').html(content);
        });

        registerHelpers();
    });
}

// код привязан к альпаке
function onMoveItem() {
    // грязный хак для того, чтобы дождаться пока отрисуются все элементы при перемещиении вверх-вниз
    setTimeout(function () {
        onElementsUpdate();
    }, 500);
}

function setVariantsValue(self, data) {
    $(self).parent().find('.text-input').val('');
    var variantsElement = $(self).parent().parent().parent().parent().parent().find('div[data-alpaca-item-container-item-key=variants]');
    variantsElement = Alpaca(variantsElement);
    variantsElement.setValue(data);
}

function fillStringArray(self) {
    var variantsDraw = $(self).parent().find('.variants-draw');
    var val = $(self).parent().find('.text-input').val();
    var explodedVal = val.split('#');
    var json = JSON.stringify(explodedVal);

    var stringToDraw = "<select>";
    $.each(explodedVal, function (k, v) {
        stringToDraw += "<option>" + v + "</option>";
    });
    stringToDraw += "</select>";
    variantsDraw.html(stringToDraw);

    setVariantsValue(self, json);
}

function fillString(self, fromJson) {
    var val, json, explodedVal, variantsDraw;
    if (fromJson) {
        variantsDraw = $(self).parent().find('.variants-draw');
        json = $(self).parent().parent().parent().parent().parent().parent().find('div[data-alpaca-item-container-item-key=variants] input').val();
        try {
            val = JSON.parse(json);
        } catch (e) {
            val = '';
        }
    } else {
        variantsDraw = $(self).parent().find('.variants-draw');
        val = $(self).parent().find('.text-input').val();
        explodedVal = val.split('#');
        json = JSON.stringify(explodedVal);
    }

    variantsDraw.html(val);

    setVariantsValue(self, json);
}

function fillSingle(self, fromJson) {
    var val, json, explodedVal, variantsDraw;
    if (fromJson) {
        variantsDraw = $(self).parent().find('.variants-draw');
        json = $(self).parent().parent().parent().parent().parent().parent().find('div[data-alpaca-item-container-item-key=variants] input').val();
        try {
            explodedVal = JSON.parse(json);
        } catch (e) {
            explodedVal = [];
        }
    } else {
        variantsDraw = $(self).parent().find('.variants-draw');
        val = $(self).parent().find('.text-input').val();
        explodedVal = val.split('#');
        json = JSON.stringify(explodedVal);
    }

    var stringToDraw = "";
    var randomName = randomString();
    $.each(explodedVal, function (k, v) {
        // todo add editor for each element
        stringToDraw += "<input type='radio' name='" + randomName + "'> " + v;
    });
    variantsDraw.html(stringToDraw);

    if (!fromJson) {
        setVariantsValue(self, json);
    }
}

function fillMulti(self, fromJson) {
    var val, json, explodedVal, variantsDraw;
    if (fromJson) {
        variantsDraw = $(self).parent().find('.variants-draw');
        json = $(self).parent().parent().parent().parent().parent().parent().find('div[data-alpaca-item-container-item-key=variants] input').val();
        explodedVal = JSON.parse(json);
    } else {
        variantsDraw = $(self).parent().find('.variants-draw');
        val = $(self).parent().find('.text-input').val();
        explodedVal = val.split('#');
        try {
            json = JSON.stringify(explodedVal);
        } catch (e) {
            explodedVal = [];
        }
    }

    var stringToDraw = "";
    var randomName = randomString();
    $.each(explodedVal, function (k, v) {
        // todo add editor for each element
        stringToDraw += "<input type='checkbox' name='" + randomName + "'> " + v;
    });
    variantsDraw.html(stringToDraw);

    if (!fromJson) {
        setVariantsValue(self, json);
    }
}

$(document).ready(function () {
    $('html').on('click', '.add-string-array', function () {
        fillStringArray(this);
    });

    $('html').on('click', '.add-string', function () {
        fillString(this);
    });

    $('html').on('click', '.add-single', function () {
        fillSingle(this);
    });

    $('html').on('click', '.add-multi', function () {
        fillMulti(this);
    });

    //Alpaca.registerTemplate("arrayItemToolbar", '<div class="ui-widget-header ui-corner-all alpaca-fieldset-array-item-toolbar">{{each(k,v) buttons}}<button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-${v.feature}">${v.label}</button>{{/each}}</div>');
    Alpaca.registerTemplate("arrayItemToolbar", '<div class="ui-widget-header ui-corner-all alpaca-fieldset-array-item-toolbar">' +
        '<button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-add btn btn btn-primary" title="Добавить вопрос"><i class="glyphicon glyphicon-plus"></i></button>' +
        '<button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-remove btn btn-warning" title="Удалить вопрос"><i class="glyphicon glyphicon-minus"></i></button>' +
        '<button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-up btn btn-primary" title="Переместить вверх"><i class="glyphicon glyphicon-arrow-up"></i></button>' +
        '<button class="alpaca-fieldset-array-item-toolbar-icon alpaca-fieldset-array-item-toolbar-down btn btn-primary" title="Переместить вниз"><i class="glyphicon glyphicon-arrow-down"></i></button>' +
        '</div>');
    var schema = {
        //"description": "Все вопросы по олимпиаде",
        "type": "array",
        "items": {
            /*"title": "Вопрос",*/
            "type": "object",
            "properties": {
                "id": {
                    "type": "string"
                },
                "description": {
                    "title": "Текст вопроса",
                    "type": "string"
                },
                "points": {
                    "title": "Количество баллов за ответ",
                    "type": "string"
                },
                "questionType": {
                    "title": "Тип вопроса",
                    "type": "string",
                    "enum": ["single", "multi", "string", "stringArray"],
                    "options": {
                        "type": "select",
                        "label": "Who is your favorite guitarist?",
                        "removeDefaultNone": true,
                        "onFieldChange": function (e) {
                            alert("Current select is " + this.getValue());
                        }
                    }
                },
                "variants": {
                    /*"title": "Варианты ответов",*/
                    "type": "string"
                },
                "correctAnswer": {
                    /*"title": "Правильный ответ",*/
                    "type": "string"
                },
                "points": {
                    "title": "Количество баллов за ответ",
                    "type": "string"
                },
                "myCheck": {
                    //"title": "Check this out",
                    "type": "string"
                }
            }
        }
    };

    var options = {
        "fields": {
            "item": {
                "fields": {
                    "id": {
                        "type": "hidden"
                    },
                    "variants": {
                        "type": "hidden"
                    },
                    "correctAnswer": {
                        "type": "hidden"
                    },
                    "description": {
                        "type": "textarea"
                    },
                    "questionType": {
                        "type": "select",
                        "optionLabels": ["Одиночный", "Множественный выбор", "Строка", "Строка с вариациями"],
                        "removeDefaultNone": true
                    },
                    "myCheck": {
                        "type": "checkbox",
                        "rightLabel": "Чекни меня"
                    }
                }
            }
        },
        "items": {
            "moveUpItemLabel": "Вверх",
            "moveDownItemLabel": "Вниз",
            "removeItemLabel": "Удалить вопрос",
            "addItemLabel": "Добавить вопрос",
            "showMoveDownItemButton": true,
            "showMoveUpItemButton": true
        },
        "toolbarSticky": true
    };

    var form = {
        "attributes": {
            "action": "save",
            "method": "post",
            "enctype": "multipart/form-data"
        },
        "buttons": {
            "submit": {}
        }
    };

    function onChangeElements() {
        var selector = '.alpaca-fieldset-array-item-toolbar-icon';
        $.each($(selector), function (k, v) {
            console.log(v);
            if (!$(v).hasClass('btn btn-primary')) {
                $(v).addClass('btn btn-primary');
            }
        });


        $(selector).css('margin-right', '8px');
    }

    $("#test-editor").alpaca({
        "postRender": function (form) {
            $('.all-content').show('slow');
            $('.loading').hide();
            $("#serialize").click(function () {
                var json = form.getValue();
                console.log(JSON.stringify(json));
                localStorage.setItem('json', JSON.stringify(json));
                alert('Сохранено!');
            });

            onElementsUpdate();
        },
        "data": data,
        "schema": schema,
        "options": options,
        "renderForm": true,
        "form": form,
        "view": {
            "parent": "VIEW_WEB_EDIT",
            "displayReadonly": true,
            "collapsible": false,
            "templates": {
                "controlFieldOuterEl": "<span>{{if options.type=='textarea'}}" +
                    "<div class='textarea-content'>{{html data}}</div>" +
                    "<div><a class='edit-textarea' href='#'>Редактировать</a> </div>" +
                    "{{/if}}" +
                    "{{if options.type!='textarea'}}{{html this.html}}{{/if}}" +
                    "</span>"
            }
        }
    });

    var exam = new Exam();
    $('.btn-add-question').click(function (e) {
        //exam.addQuestion();
        $('#modal').easyModal({
            top: 100,
            autoOpen: true,
            overlayOpacity: 0.3,
            overlayColor: "#333",
            overlayClose: false,
            closeOnEscape: false
        });
    });

    $('html').on('click', '.lean-overlay', function () {
        $('#modal').trigger('closeModal');
    });
    $('.btn-close-modal').click(function (e) {
        $('#modal').trigger('closeModal');
    });

    CKEDITOR.replace('modalEditor');

    $('html').on('click', '.edit-textarea', function (e) {
        e.preventDefault();
        var textarea = $(this).parent().parent().parent();
        textarea = Alpaca(textarea);
        var textareaContent = $(this).parent().parent().find('.textarea-content');
        CKEDITOR.instances['modalEditor'].setData(textarea.getValue());
        $('.btn-save-modal').unbind('click');
        $('.btn-save-modal').click(function (e) {
            var text = CKEDITOR.instances['modalEditor'].getData();
            textarea.setValue(text);
            textareaContent.html(text);
            $('#modal').trigger('closeModal');
        });
        $('#modal').easyModal({
            top: 100,
            autoOpen: true,
            overlayOpacity: 0.3,
            overlayColor: "#333",
            overlayClose: false,
            closeOnEscape: true
        });
    });

    $('#controls-body').hover(function () {
        var totalPoints = 0;
        var questionsCount = $('input[name*="_points"]').length;
        $.each($('input[name*="_points"]'), function (k, v) {
            var element = Alpaca($(v).parent().parent().parent());
            var points = parseInt(element.getValue());
            if (points >= 0) {

            } else {
                points = 0;
            }

            totalPoints += points;
        });

        $('#test-information').show('slow');
        $('#totalPoints').text(totalPoints);
        $('#questionCount').text(questionsCount);
    }, function () {
        $('#test-information').hide('slow');
    });
});