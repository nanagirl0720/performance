package com.xima.per.controller;

import com.xima.per.entity.User;
import com.xima.per.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


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

    @DeleteMapping("/deleteById")
    public void deleteById(Integer id){
        userService.deleteById(id);
    }
    @ResponseBody
    @GetMapping("/{id}")
    public User getOne( @PathVariable("id") Integer id){
       return userService.getOne(id);
    }
    @CrossOrigin
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

    @RequestMapping("/test")
    public String index(Model model){
        model.addAttribute("name","beauty");
        return "test";
    }

    @RequestMapping("/selectuser")
    public String selectuser(Map map){
        List<User> userList = userService.findAll();
        map.put("userArrayList",userList);
        return "selectuser";
    }
}
