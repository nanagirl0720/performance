package com.xima.per.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author: Pxn
 * @date: 2019/10/28 22:57
 */
@Controller
@RequestMapping(value = "/demo")
public class TestDemo {
    @RequestMapping(value = "/test")
    public String test(ModelMap map){
        map.addAttribute("name","pxn");
        return "thymeleaf/test";
    }
}
