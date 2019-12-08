package com.xima.per.controller;

import com.xima.per.entity.User;
import com.xima.per.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author: Pxn
 * @date: 2019/11/3 16:16
 */
@Controller
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @ResponseBody
    @PostMapping("/save")
    public User save(User user){
        return userService.save(user);
    }

    @DeleteMapping("/delete")
    public void delete(User user){
        userService.delete(user);
    }

/*
    @ResponseBody
    @GetMapping("/{id}")
    public User getOne( @PathVariable("id") Integer id){
       return userService.getOne(id);
    }
*/

    @GetMapping("/all")
    @ResponseBody
    public List<User> findAll(){
        return userService.findAll();
    }

    @GetMapping("/tr/{id}")
    @ResponseBody
    public  User findById(@PathVariable ("id") Integer id){
       return  userService.findById(id);
    }

    @RequestMapping("/index")
    public String index(){
        return "index";
    }

    @RequestMapping("/login")
    public String login(){
        return "userlogin";
    }

    @RequestMapping("/top")
    public String top(){
        return "top";
    }

    @RequestMapping("/skip_left")
    public String skip_left(){
        return "skip_left";
    }

    @RequestMapping("/change")
    public String change(){
        return "change";
    }

    @RequestMapping("/bottom")
    public String bottom(){
        return "bottom";
    }

}
