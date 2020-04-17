package com.xima.per.controller;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.thymeleaf.util.StringUtils;

/**
 * @author: Pxn
 * @date: 2019/12/3 20:36
 */
@Controller
@RequestMapping(value = "/login")
public class LoginController {

    @PostMapping(value = "/post")
    public String login(@Param("username") String username, @Param("password") String password){
        if(!StringUtils.isEmpty(username) && "1234".equals(password)){
            //登录成功！
            return "index0";
        }else {
            return "userlogin";
        }

    }
}
