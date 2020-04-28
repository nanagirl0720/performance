package com.xima.per.controller;

import com.xima.per.entity.Result;
import com.xima.per.entity.User;
import com.xima.per.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.HtmlUtils;

import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Objects;

/**
 * @author: Pxn
 * @date: 2019/12/3 20:36
 */
@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    @CrossOrigin
    @PostMapping(value = "api/login")
    @ResponseBody
    public Result login(@RequestBody User requestUser, HttpSession session) {
        // 对 html 标签进行转义，防止 XSS 攻击
        String username = requestUser.getUsername();
        username = HtmlUtils.htmlEscape(username);
        List<User> userList = userService.findAll();
        Result result=null;
        for (User user : userList) {
            if (!Objects.equals(user.getUsername(), username) || !Objects.equals(user.getPassword(), requestUser.getPassword())) {
                result=new Result(400);
            } else {
                session.setAttribute("user",user);
                result=new Result(200);
                break;
            }
        }
        return result;
    }
}